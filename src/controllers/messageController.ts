import { Request, Response } from "express";
import * as amqp from "amqplib";
import * as admin from "firebase-admin";

const pushQueue = "push-campaign";
const consumerQueue = "message-queue";

const batchSize = 1000;

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

export async function sendMessages(
  req: Request,
  res: Response
): Promise<void | Response<any, Record<string, any>>> {
  try {
    const numMessages: number = req.body.numMessages;
    console.log(numMessages);

    if (!numMessages || typeof numMessages !== "number" || numMessages <= 0) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const connection = await amqp.connect("amqp://root:root@localhost");
    const channel = await connection.createChannel();
    await channel.assertQueue(pushQueue, { durable: false });

    let startTime = Date.now();
    const timeToSend = new Date("2023-09-26T15:00:00");
    const messageTTL = timeToSend.getTime() - Date.now();
    console.log(messageTTL);
    for (let i = 0; i < numMessages; i++) {
      const dummyMessage = {
        title: `Message ${i}`,
        body: `This is message number ${i}`,
        image: "1",
        url: `www.image-${i}.com`,
      };
      const messageProperties = {
        expiration: messageTTL.toString(),
      };

      channel.sendToQueue(
        pushQueue,
        Buffer.from(JSON.stringify(dummyMessage)),
        messageProperties
      );

      //   channel.sendToQueue(pushQueue, Buffer.from(JSON.stringify(dummyMessage)));
    }
    let endTime = Date.now();
    let elapsedSeconds = (endTime - startTime) / 1000;
    console.log(
      `Elapsed time for sending ${numMessages} messages: ${elapsedSeconds} seconds`
    );

    return res
      .status(200)
      .json({ message: `Sent ${numMessages} dummy messages to RabbitMQ.` });
  } catch (error) {
    console.error("Error sending dummy messages to RabbitMQ:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getMessages(
  req: Request,
  res: Response
): Promise<void | Response<any, Record<string, any>>> {
  try {
    const numMessages: number = req.body.numMessages;
    console.log(numMessages);

    if (!numMessages || typeof numMessages !== "number" || numMessages <= 0) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const connection = await amqp.connect("amqp://root:root@localhost");
    const channel = await connection.createChannel();
    await channel.assertQueue(pushQueue, { durable: false });

    let totalMsg = numMessages;
    let batchNum = 0;
    while (totalMsg > 0) {
      ++batchNum;
      let startTime = Date.now();
      console.log("Batch: ", batchNum, " - Total: ", totalMsg);
      for (let i = 0; i < batchSize; i++) {
        const message = await channel.get(pushQueue, { noAck: false });
        // console.log("Batch: ", batchNum, " - iteration: ", i);
        if (!message) {
          break;
        }
        const messageData = JSON.parse(message.content.toString());
        // console.log(messageData);
        await sendToFCM(messageData);
        channel.ack(message);
      }
      let endTime = Date.now();
      let elapsedSeconds = (endTime - startTime) / 1000;
      console.log(`Elapsed time: ${elapsedSeconds} seconds`);
      totalMsg -= 1000;
    }
    return res
      .status(200)
      .json({ message: `Get ${numMessages} dummy messages to RabbitMQ.` });
  } catch (error) {
    console.error("Error getting dummy messages to RabbitMQ:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function sendToFCM(messageData: any) {
  try {
    const registrationToken = messageData.registrationToken;
    const notification = {
      title: messageData.title,
      body: messageData.body,
      image: messageData.image,
      url: messageData.url,
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
