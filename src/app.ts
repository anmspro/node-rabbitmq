import * as amqp from "amqplib";
// import * as admin from "firebase-admin";

const queueName = "message-queue";
const batchSize = 1000;

// admin.initializeApp({
//   credential: admin.credential.applicationDefault(),
// });

const processMessages = async (queueName: string, batchSize: number) => {
  try {
    const connection = await amqp.connect("amqp://root:root@localhost");
    const channel = await connection.createChannel();

    await channel.assertQueue(queueName, { durable: false });

    while (true) {
      const messagesBatch = [];
      for (let i = 0; i < batchSize; i++) {
        const message = await channel.get(queueName, { noAck: false });
        console.log("iteration: ", i, " = ", message);
        if (!message) {
          break;
        }
        messagesBatch.push(message);
      }

      if (messagesBatch.length === 0) {
        break;
      }

      for (const message of messagesBatch) {
        const messageData = JSON.parse(message.content.toString());
        console.log(messageData);
        // await sendToFCM(messageData);

        channel.ack(message);
      }
    }
    connection.close();
  } catch (error) {
    console.log(
      "❌ ~ file: rabbitmq.js ~ processMessages ~ error:",
      (error as Error).message
    );
    throw error;
  }
};

processMessages(queueName, batchSize);

// async function sendToFCM(messageData: any) {
//   try {
//     const registrationToken = messageData.registrationToken;
//     const payload = {
//       notification: {
//         title: messageData.title,
//         body: messageData.body,
//       },
//     };

//     const response = await admin
//       .messaging()
//       .sendToDevice(registrationToken, payload);

//     console.log("FCM Response:", response);
//   } catch (error) {
//     console.error("Error sending message to FCM:", error);
//   }
// }
