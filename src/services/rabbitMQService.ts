import amqp from "amqplib";
import rabbitMQConfig from "../config/rabbitMQConfig";

export async function createRabbitMQConnection() {
  try {
    const connection = await amqp.connect(rabbitMQConfig.connectionString);
    const channel = await connection.createChannel();
    await channel.assertQueue(rabbitMQConfig.producerQueue, {
      durable: true,
      // arguments: {
      //   "x-message-ttl": 0,
      // },
    });
    return channel;
  } catch (error) {
    console.error("Error creating RabbitMQ connection:", error);
    throw error;
  }
}

export async function sendMessageToQueue(channel: any, message: string) {
  try {
    channel.sendToQueue(
      rabbitMQConfig.producerQueue,
      Buffer.from(JSON.stringify(message)),
      {
        persistent: true,
      }
    );
  } catch (error) {
    console.error("Error sending message to RabbitMQ:", error);
    throw error;
  }
}

export async function getMessageFromQueue(channel: any) {
  try {
    const message = await channel.get(rabbitMQConfig.consumerQueue, {
      noAck: false,
    });
    return message;
  } catch (error) {
    console.error("Error getting message from RabbitMQ:", error);
    throw error;
  }
}

export async function acknowledgeMessage(channel: any, message: any) {
  try {
    channel.ack(message);
  } catch (error) {
    console.error("Error acknowledging message:", error);
    throw error;
  }
}
