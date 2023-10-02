import { Request, Response } from "express";
import {
  createRabbitMQConnection,
  getMessageFromQueue,
  acknowledgeMessage,
  sendMessageToQueue,
} from "../services/rabbitMQService";
import { fetchPushNotifications } from "../services/mysqlService";
import { sendNotificationToFCM } from "../services/fcmService";

export async function Producer(req: Request, res: Response) {
  try {
    const numMessages: number = req.body.numMessages;
    console.log(numMessages);

    if (!numMessages || typeof numMessages !== "number" || numMessages <= 0) {
      return res.status(400).json({ error: "Invalid input" });
    }

    let startTime = Date.now();
    const channel = await createRabbitMQConnection();
    const pushNotifications = await fetchPushNotifications();

    Object.values(pushNotifications).forEach((value) => {
      sendMessageToQueue(channel, value);
    });

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

export async function Consumer(req: Request, res: Response) {
  try {
    const numMessages: number = req.body.numMessages;
    console.log(numMessages);

    if (!numMessages || typeof numMessages !== "number" || numMessages <= 0) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const channel = await createRabbitMQConnection();
    let batchSize = 1000;

    let totalMsg = numMessages;
    let batchNum = 0;
    while (totalMsg > 0) {
      if (totalMsg < batchSize) batchSize = totalMsg;
      ++batchNum;
      let startTime = Date.now();
      console.log("Batch: ", batchNum, " - Total: ", totalMsg);
      for (let i = 0; i < batchSize; i++) {
        const message = await getMessageFromQueue(channel);
        console.log("Batch: ", batchNum, " - iteration: ", i);
        if (!message) {
          break;
        }
        const messageData = JSON.parse(message.content.toString());
        const registrationToken =
          "eFgG41JeSBi0sQUOxTqgYO:APA91bFaEb3s4ykQMSqccMQxExhqlFBm9eAVJmytkNHPkRtwwY2mVzsu-PlKgHx-9i01Y6Nl5cLvBRr2Ys3iOAgsqBZGd6URBFqpi5kD7XZ6lq9pUDv3OgMD1fXvgaRpyf2g-l2lNtJ_";
        console.log(messageData);
        await sendNotificationToFCM(messageData, registrationToken);
        acknowledgeMessage(channel, message);
      }
      let endTime = Date.now();
      let elapsedSeconds = (endTime - startTime) / 1000;
      console.log(`Elapsed time: ${elapsedSeconds} seconds`);
      totalMsg -= 1000;
    }
    return res.status(200).json({
      message: `Received ${numMessages} dummy messages from RabbitMQ.`,
    });
  } catch (error) {
    console.error("Error getting dummy messages from RabbitMQ:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
