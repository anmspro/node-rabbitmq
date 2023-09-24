import * as amqp from "amqplib";

const queueName = "message-queue";
const numMessagesToFetch = 1000;

async function consumeMessages() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  await channel.assertQueue(queueName, { durable: false });

  let messagesReceived = 0;

  channel.consume(
    queueName,
    (message) => {
      if (message !== null) {
        console.log(`Received message: ${message.content.toString()}`);
        messagesReceived++;

        channel.ack(message);

        if (messagesReceived === numMessagesToFetch) {
          console.log(`Received ${numMessagesToFetch} messages. Exiting...`);
          connection.close();
        }
      }
    },
    { noAck: false }
  );
}

consumeMessages().catch(console.error);
