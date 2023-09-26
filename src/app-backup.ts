import * as amqp from "amqplib";
import * as admin from "firebase-admin";

const queueName = "message-queue";
const batchSize = 100;

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const processMessages = async (queueName: string, batchSize: number) => {
  try {
    const connection = await amqp.connect("amqp://root:root@localhost");
    const channel = await connection.createChannel();

    await channel.assertQueue(queueName, { durable: false });

    let startTime = Date.now();
    for (let i = 0; i < batchSize; i++) {
      const dummyMessage = {
        title: `Message ${i}`,
        body: `This is message number ${i}`,
        registrationToken: `dummy-token-${i}`,
      };
      channel.sendToQueue(queueName, Buffer.from(JSON.stringify(dummyMessage)));
      // await sendToFCM(dummyMessage);
      console.log(`Published message ${i}`);
    }
    let endTime = Date.now();
    let elapsedSeconds = (endTime - startTime) / 1000;
    console.log(`Elapsed time: ${elapsedSeconds} seconds`);

    // while (true) {
    //   const messagesBatch = [];
    //   let startTime = Date.now();
    //   for (let i = 0; i < batchSize; i++) {
    //     const message = await channel.get(queueName, { noAck: false });
    //     console.log("iteration: ", i, " = ", message);
    //     if (!message) {
    //       break;
    //     }
    //     messagesBatch.push(message);
    //   }
    //   let endTime = Date.now();
    //   let elapsedSeconds = (endTime - startTime) / 1000;
    //   console.log(`Elapsed time: ${elapsedSeconds} seconds`);
    //   if (messagesBatch.length === 0) {
    //     break;
    //   }

    //   for (const message of messagesBatch) {
    //     const messageData = JSON.parse(message.content.toString());
    //     console.log(messageData);
    //     // await sendToFCM(messageData);

    //     channel.ack(message);
    //   }
    //   break;
    // }
    connection.close();
  } catch (error) {
    console.log(
      "❌ ~ file: rabbitmq.js ~ processMessages ~ error:",
      (error as Error).message
    );
    throw error;
  }
};

async function sendToFCM(messageData: any) {
  try {
    const registrationToken = messageData.registrationToken;
    const notification = {
      title: messageData.title,
      body: messageData.body,
    };

    const response = await admin.messaging().send({
      data: notification,
      token: registrationToken,
    });

    console.log("FCM Response:", response);
  } catch (error) {
    console.error("Error sending message to FCM:", error);
  }
}

processMessages(queueName, batchSize);
