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

export async function sendNotificationToFCM(notification: any, token: string) {
  try {
    if (!token) {
      console.error("Error: token is missing or empty.");
      return;
    }

    // const sampleNotification = {
    //   title: notification.title,
    //   body: notification.body,
    //   image_url: notification.image_url,
    // };

    console.log("notification ", notification);
    // console.log("sampleNotification ", sampleNotification);
    const response = await admin.messaging().send({
      data: notification,
      // data: sampleNotification,
      // token: token,
      token:
        "fTojy0jESYaopNrVx_0Rh1:APA91bEkIFUupN3HsvtGiTFLtnUVc0px160kKw_uxbtPcmU1h4aHOPSdZh4im6o8koP3cC8TTfRkkq4pcCaie4I-lALIlMmuoobndNPCsgndhaJTGNGCjSdjz2f9WjXPdDEiSjmv57fO",
    });

    console.log("FCM Response:", response);
  } catch (error) {
    console.error("Error sending message to FCM:", error);
    throw error;
  }
}
