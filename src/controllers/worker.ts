const parentPort = require("worker_threads");
const workerData = require("worker_threads");

if (parentPort) {
  parentPort.on("message", async (message: any) => {
    if (message === "start") {
      const { numMessages, queueName } = workerData;
      const amqp = require("amqplib");

      try {
        const connection = await amqp.connect("amqp://root:root@localhost");
        const channel = await connection.createChannel();
        await channel.assertQueue(queueName, { durable: false });

        let startTime = Date.now();
        for (let i = 0; i < numMessages; i++) {
          const dummyMessage = {
            title: `Message ${i}`,
            body: `This is message number ${i}`,
            registrationToken: `dummy-token-${i}`,
          };
          channel.sendToQueue(
            queueName,
            Buffer.from(JSON.stringify(dummyMessage))
          );
        }
        let endTime = Date.now();
        let elapsedSeconds = (endTime - startTime) / 1000;
        console.log(
          `Elapsed time for sending ${numMessages} messages: ${elapsedSeconds} seconds`
        );

        connection.close();
        parentPort.postMessage({ result: "Worker finished task" });
      } catch (error) {
        console.error("Worker error:", error);
        parentPort.postMessage({ error: "Worker encountered an error" });
      }
    }
  });
}
