import { Request, Response } from "express";
import {
  createRabbitMQConnection,
  getMessageFromQueue,
  acknowledgeMessage,
  sendMessageToQueue,
} from "../services/rabbitMQService";
import { fetchPushNotifications } from "../services/mysqlService";
import { sendNotificationToFCM } from "../services/fcmService";
import { Redis } from "ioredis";

const pushes: any = {};

export async function Producer(req: Request, res: Response) {
  try {
    const numMessages: number = req.body.numMessages;

    if (!numMessages || typeof numMessages !== "number" || numMessages <= 0) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const channel = await createRabbitMQConnection();

    // Fetch push notifications from db
    const pushNotifications = await fetchPushNotifications();

    // Fetch tokens from redis
    const redisTokens = await redisClient.smembers("web-staging:token-storage");
    const tokens = JSON.parse(redisTokens[1]);

    if (!tokens || tokens.length === 0) {
      console.log("No tokens found in Redis.");
      return;
    }

    // design the push notification
    const pushesToSend: any = [];
    for (const token of tokens) {
      Object.values(pushNotifications).forEach((value) => {
        pushesToSend.push({ p_id: value.id, token });
        pushes[value.id] = {
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

// todo: store pushes in array (dp)
// const pushes = [];
// pushes[1] = {title: "asdfasdf", image: "asdfasdf.png"}
// if (pushes[1]) {sendpush using this data}
// or fetch push 1 first
// book keeping

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
        if (pushes[messageData.p_id]) {
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
      message: `Received ${numMessages} dummy messages from RabbitMQ.`,
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

async function sendNotificationToToken(
  messageData: any,
  registrationToken: string
) {
  try {
    console.log(`Sending message to token: ${registrationToken}`);
    await sendNotificationToFCM(messageData, registrationToken);
  } catch (error) {
    console.error(
      `Error sending message to token: ${registrationToken}`,
      error
    );
  }
}

async function sendMessagesToAllTokens(messageData: any) {
  console.log("entered sendMessagesToAllTokens");
  const redisTokens = await redisClient.smembers("web-staging:token-storage");
  const tokens = JSON.parse(redisTokens[1]);

  if (!tokens || tokens.length === 0) {
    console.log("No tokens found in Redis.");
    return;
  }

  for (const token of tokens) {
    console.log("Token:", token);
  }

  // await sendNotificationToToken(messageData, token);

  console.log("All messages sent.");
}
