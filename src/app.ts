import * as amqp from "amqplib";

const queueName = "my-queue";
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

        // Acknowledge the message to remove it from the queue
        channel.ack(message);

        // Check if we have received the desired number of messages
        if (messagesReceived === numMessagesToFetch) {
          console.log(`Received ${numMessagesToFetch} messages. Exiting...`);
          connection.close();
        }
      }
    },
    { noAck: false } // Ensure that messages are not automatically acknowledged
  );
}

consumeMessages().catch(console.error);
