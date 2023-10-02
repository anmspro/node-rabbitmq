import { Request, Response } from "express";
import * as amqp from "amqplib";
import * as admin from "firebase-admin";
import mysql from "mysql2/promise";

const dbConfig = {
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "binge.v2",
};

const producerQueue = "push-campaign";
const consumerQueue = "push-campaign";

let batchSize = 1000;

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "binge-mobile",
    clientEmail: "firebase-adminsdk-uzr71@binge-mobile.iam.gserviceaccount.com",
    privateKey:
      "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCJjNENWqXuPjyn\n+Mwao7tzCtyYAXmtp35TPKp4pkIbShHSLGuSgi4O+H2Dy/mdrkKsiUiCGu6WHUxk\nWLSg//rwlGhyaXZ2ztcDGYgPcVGq94wNB4v6mqxcRoGWTdWK+kUbimWygT6miX2m\nbgAcL7GixPoVHo8bVyYVfnMdylspGVqtqMQU70DcMxlvzdJ7jbqiuuBAhla+XYXb\nXZPZj6MbA9m4eIonNMugpR1XbXkLncknp83JCFO9XttSlFsiH/jhjqtVGOOcESVW\nkEDTpiHKKG94Ga4wWms52L3dreasqdkUq8h+YBDf/PvnMZkkFCpHDjjV77yMG2Qf\nogiroUElAgMBAAECggEAEeBszQ0Ccr/A9120/SNZed6oA9NxQnn5x4yjZTHKdqx+\nO3ANfQmRPd3axjXM18rtnGntNAeXCYh+RK5or2IFdZ38Ix6EyHUiaaM4VTV3lT4+\nA/V+ok/W5dk9/1BXWAwlzioDBJuajl9hJq+2MPOb5RkvnW4O0FFXwERiZrVFesZB\ngicGj1eegZ0bdjRD7c0QIrBBkwVEE/yvX5EDzIH3S2QsqWyIqM0yYauXxOPruB67\n3Q2Ey+CFO5OpyoGSKlsbej89WReHkFd5tK66h6ePz5SbogE3QEYuK26Vu59Shiky\nAc9W62w1UgLgOIk1IZv3RqyigySbmC39BkWMdOL1cwKBgQC//A3k7A+cNazAXQo9\nw1DiHiZWy+s/WQq4Y9AfIi/YeJvRkNNGES6yAezNBkYSYDNJU/iui+YoJ6chR9KL\nzpCySxZEHHFPH7ZYBc1zdm3yELjwzT5bDYOICXvQRh40qDdSKXlFIXyDrTSoroCb\ngaUaStFKqBaTJ+GF4joma4sF0wKBgQC3ajECSKb2aQMjIP0S2MIdbZ7xgA/XDccy\noI1PR/rD2JkNHHGkhmBpgyEqRFRUxSkCIAOktF7GP7da4V/aW+wIaCIBSs/ddwx1\n0YG9d9icMPwastN49infhMwKEEstyZtK6YipPYG+JxHlBk4WVLERf7g6gyxJ7up4\nPOCryo5qJwKBgQCuLr1caWBwVbJ6hO95we9sd/ZI4ZJ6UwsK6GQ3GwlV2Xdl14QY\nGhbHoj96dKq2mVluuiTyGDOlUvSrmUJJXgyh9sYo3bVgGGGT0w/oJhbyfIGO2Ggu\nrEAd+JzBBhz5oXUvsjk4o30Y6tjQAiLk8+cbx63DkmWI9bIDipE/smrbyQKBgQCD\ndfRsm6A4Cyp5ekKJyJzRNOnwVIaF8FUvH05JXeEJkGyariFx9/KQjbEut0zueWYc\nJNAXtEQdujt0QwdN3ga+O8zrujBknthqdeCU6Zpy0NVRWY0jLOT0VR1dtTH9Pnw0\n5E/UZcZhgWVdDvjXHprPXQixv6T11O1vgsrRttv+jwKBgDnfj5RPMjG/q9Kvg3Vh\npjAbK51tzeVuaTRsL8IdES/uJhGXuYJlwCZfhk9mTQ1lPVZZrTUUH4zkPqvptM9M\n6DCmsirJyMETQ+DlSUyc99b+uAs6z1urhbzOaRd84QZaSdNDl9QHQ+CQysbdPC9Q\nschj4qd+IQ4wwoRe2fxo+SWR\n-----END PRIVATE KEY-----\n",
  }),
  databaseURL: "https://binge-mobile.firebaseio.com",
});

async function fetchPushNotifications(channel: any) {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.query("SELECT * FROM push_notifications");

    Object.values(rows).forEach((value) => {
      // console.log(value);
      // const pushNotification = {
      //   id: value.id,
      //   title: row.title,
      //   body: row.body,
      //   image_url: row.image_url,
      // };

      channel.sendToQueue(producerQueue, Buffer.from(JSON.stringify(value)));
    });

    await connection.end();
  } catch (error) {
    console.error("Error fetching push_notifications:", error);
  }
}

export async function Producer(
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
    await channel.assertQueue(producerQueue, { durable: false });

    let startTime = Date.now();
    // const timeToSend = new Date("2024-10-01T17:13:00");
    // const messageTTL = timeToSend.getTime() - Date.now();
    // console.log(messageTTL);
    // for (let i = 0; i < numMessages; i++) {
    //   const dummyMessage = {
    //     title: `Message ${i}`,
    //     body: `This is message number ${i}`,
    //     image: "1",
    //     url: `https://i.ibb.co/9wrLHhZ/reddot-logo.jpg`,
    //   };

    //   const messageProperties = {
    //     expiration: messageTTL.toString(),
    //   };

    //   channel.sendToQueue(
    //     producerQueue,
    //     Buffer.from(JSON.stringify(dummyMessage)),
    //     messageProperties
    //   );
    // }

    await fetchPushNotifications(channel);

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

export async function Consumer(
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
    await channel.assertQueue(consumerQueue, { durable: false });

    let totalMsg = numMessages;
    let batchNum = 0;
    while (totalMsg > 0) {
      if (totalMsg < batchSize) batchSize = totalMsg;
      ++batchNum;
      let startTime = Date.now();
      console.log("Batch: ", batchNum, " - Total: ", totalMsg);
      for (let i = 0; i < batchSize; i++) {
        const message = await channel.get(consumerQueue, { noAck: false });
        console.log("Batch: ", batchNum, " - iteration: ", i);
        if (!message) {
          break;
        }
        const messageData = JSON.parse(message.content.toString());
        console.log(messageData);
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
      .json({ message: `Get ${numMessages} dummy messages from RabbitMQ.` });
  } catch (error) {
    console.error("Error getting dummy messages from RabbitMQ:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function sendToFCM(messageData: any) {
  try {
    let tokens = [
      "fNBKF44MRCiZrkzHCt6v5K:APA91bHcNgSvmqMbZQ-dHkiq8b3h8YTU9tW_xKywF847ZuwdPUBJQALBHAUhmqxz1XJgRNZfMBSoljrJFG657A567pv2nOYJtRnhsxj0KzJamZ4-DvHy0Eqf7QLkjdKI_oIxchYgpT6w",
      "eH4CtlDfS36-vDQILBw45D:APA91bEfgMYWmWe_zeP2H3GNtNOtwsHqYmtW5Z0pIpdeF1T4In_kmw2EHVdoV-YPLgYlaXTMtRpz6OZ97BtArnKUfZDreaCbBQkvK3YZlcx-FVPODMKFR8VkKEwe7httyGIYw6ilkMQz",
      "eFgG41JeSBi0sQUOxTqgYO:APA91bFaEb3s4ykQMSqccMQxExhqlFBm9eAVJmytkNHPkRtwwY2mVzsu-PlKgHx-9i01Y6Nl5cLvBRr2Ys3iOAgsqBZGd6URBFqpi5kD7XZ6lq9pUDv3OgMD1fXvgaRpyf2g-l2lNtJ_",
    ];
    const registrationToken = tokens[2];

    if (!registrationToken) {
      console.error("Error: registrationToken is missing or empty.");
      return;
    }

    const notification = {
      title: messageData.title,
      body: messageData.body,
      image_url: messageData.image_url,
    };

    const response = await admin.messaging().send({
      data: notification,
      token: registrationToken,
    });

    console.log("FCM Response:", response);
  } catch (error: any) {
    console.error("Error sending message to FCM:", error);
  }
}
