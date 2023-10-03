// controllers/producerController.ts

import { Request, Response } from "express";
import {
  createRabbitMQConnection,
  sendMessageToQueue,
} from "../services/rabbitMQService";
import { fetchPushNotifications } from "../services/mysqlService";
import { closeRedisClient } from "../services/redisService";

export async function Producer(req: Request, res: Response) {
  try {
    const numMessages: number = req.body.numMessages;
    console.log(numMessages);

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
    const pushes: any = [];
    for (const token of tokens) {
      Object.values(pushNotifications).forEach((value) => {
        pushes.push({ p_id: value.p_id, token });
      });
    }

    let startTime = Date.now();

    pushes.forEach((push: any) => {
      sendMessageToQueue(channel, push);
    });

    let endTime = Date.now();
    let elapsedSeconds = (endTime - startTime) / 1000;
    console.log(
      `Elapsed time for sending ${pushes.length} messages: ${elapsedSeconds} seconds`
    );

    return res
      .status(200)
      .json({ message: `Sent ${pushes.length} messages to RabbitMQ.` });
  } catch (error) {
    console.error("Error sending messages to RabbitMQ:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
