// fcmService.ts
import admin from "firebase-admin";
import fcmConfig from "../config/fcmConfig";

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: fcmConfig.projectId,
    clientEmail: fcmConfig.clientEmail,
    privateKey: fcmConfig.privateKey,
  }),
  databaseURL: fcmConfig.databaseURL,
});

export async function sendNotificationToFCM(
  messageData: any,
  registrationToken: string
) {
  try {
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
  } catch (error) {
    console.error("Error sending message to FCM:", error);
    throw error;
  }
}
