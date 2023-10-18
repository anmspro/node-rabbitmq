import { Request, Response } from "express";
import {
  createRabbitMQConnection,
  getMessageFromQueue,
  acknowledgeMessage,
  sendMessageToQueue,
} from "../services/rabbitMQService";
import {
  fetchPushNotifications,
  fetchPushById,
} from "../services/mysqlService";
import { sendNotificationToFCM } from "../services/fcmService";
import { Redis } from "ioredis";

const pushes: any = {};

export async function Producer(req: Request, res: Response) {
  try {
    const channel = await createRabbitMQConnection();

    // Fetch push notifications from db
    const pushNotifications = await fetchPushNotifications();

    // Fetch tokens from redis
    let token: any;
    const pushesToSend: any = [];
    const redisTokens = await redisClient.smembers("web-staging:token-storage");

    if (!redisTokens || redisTokens.length === 0) {
      console.log("No tokens found in Redis.");
      return;
    }

    for (let i = 0; i < redisTokens.length; i++) {
      token = JSON.parse(redisTokens[i]);

      let os_type: string;
      let tokenString: string;

      const colonIndex = token.indexOf(":");

      os_type = token.slice(0, colonIndex);
      tokenString = token.slice(colonIndex + 1);

      Object.values(pushNotifications).forEach((value) => {
        pushesToSend.push({
          p_id: value.id,
          token: tokenString,
          os_type: os_type,
        });

        pushes[value.id] = {
          id: value.id.toString(),
          notification_type_id: value.notification_type_id.toString(),
          click_action: value.click_action,
          device_type: value.device_type,
          content_type: value.content_type,
          content_id: value.content_id.toString(),
          priority: value.priority,
          title: value.title,
          body: value.body,
          image_url: value.image_url,
        };
      });
    }

    let startTime = Date.now();

    pushesToSend.forEach((push: any) => {
      sendMessageToQueue(channel, push);
    });

    let endTime = Date.now();
    let elapsedSeconds = (endTime - startTime) / 1000;
    console.log(
      `Elapsed time for sending ${pushesToSend.length} messages: ${elapsedSeconds} seconds`
    );

    return res
      .status(200)
      .json({ message: `Sent ${pushesToSend.length} messages to RabbitMQ.` });
  } catch (error) {
    console.error("Error sending messages to RabbitMQ:", error);
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
          console.log("message not found");
          break;
        }
        const messageData = JSON.parse(message.content.toString());
        if (pushes[messageData.p_id]) {
          console.log("message data before sending to fcm: ", messageData);
          await sendNotificationToFCM(
            pushes[messageData.p_id],
            messageData.token
          );
        } else {
          const pushNotification = await fetchPushById(messageData.p_id);
          Object.values(pushNotification).forEach((value) => {
            console.log(value);
            pushes[value.id] = {
              id: value.id.toString(),
              notification_type_id: value.notification_type_id.toString(),
              click_action: value.click_action,
              device_type: value.device_type,
              content_type: value.content_type,
              content_id: value.content_id.toString(),
              priority: value.priority,
              title: value.title,
              body: value.body,
              image_url: value.image_url,
            };
          });
          console.log("message data before sending to fcm: ", messageData);
          await sendNotificationToFCM(
            pushes[messageData.p_id],
            messageData.token
          );
        }
        acknowledgeMessage(channel, message);
      }
      let endTime = Date.now();
      let elapsedSeconds = (endTime - startTime) / 1000;
      console.log(`Elapsed time: ${elapsedSeconds} seconds`);
      totalMsg -= 1000;
    }
    return res.status(200).json({
      message: `Received ${numMessages} messages from RabbitMQ.`,
    });
  } catch (error) {
    console.error("Error getting messages from RabbitMQ:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

interface CustomRedisClientOptions {
  host: string;
  port: number;
  password: string;
}

const redisClient = new Redis({
  host: "127.0.0.1",
  port: 6379,
  password: "",
  legacyMode: true,
} as CustomRedisClientOptions);

redisClient.on("connect", () => {
  console.log("Connected to Redis12345");
});

redisClient.on("error", (err) => {
  console.log(err.message);
});

redisClient.on("ready", () => {
  console.log("Redis is ready");
});

redisClient.on("end", () => {
  console.log("Redis connection ended");
});

async function CloseRedisClient() {
  await redisClient.quit();
  console.log("Redis client has been closed.");
}

process.on("SIGINT", async () => {
  await CloseRedisClient();
  process.exit(0);
});
