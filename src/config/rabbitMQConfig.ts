export default {
  connectionString: "amqp://root:root@localhost",
  producerQueue: "push-campaign",
  consumerQueue: "push-campaign",
  batchSize: 1000,
};
