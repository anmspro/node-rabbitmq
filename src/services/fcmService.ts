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

    const sample162 =
      "https://web-api.binge.buzz/uploads/tv_channel_logo/thumbs/6PxdRuTNuTkq9qxtB1ta8XJWfjMb1iBGgH_162x162.webp";

    const sample400 =
      "https://web-api.binge.buzz/uploads/products/thumbs/aEIf2zdJHGQuYHMnJpJyUxpR9WnxwlqYiR_400x400.webp";

    const payload = {
      aps: {
        alert: {
          title: notification.title,
          body: notification.body,
          image: sample400,
        },
        badge: 2,
        sound: "default",
        mutable_content: 1,
        data: {
          attachmentUrl: sample400,
        },
      },
      imageUrl: notification.image_url ? notification.image_url : "",
      contentType: notification.content_type ? notification.content_type : "",
      clickAction: notification.click_action ? notification.click_action : "",
      pageToNavigate: notification.click_action
        ? notification.click_action
        : "",
      contentId: notification.content_id ? notification.content_id : "",
      contentDetail: notification.product
        ? notification.product.content_type.name
        : "",
      maturityLevel: notification.product
        ? notification.product.maturity_level.title
        : "",
    };
    const mess = {
      token: token,
      notification: {
        title: notification.title,
        body: notification.body,
        image: `https://web-api.binge.buzz/${notification.image_url}`,
      },
      data: {
        contentType: notification.content_type ? notification.content_type : "",
        clickAction: notification.click_action ? notification.click_action : "",
        pageToNavigate: notification.click_action
          ? notification.click_action
          : "",
        contentId: notification.content_id ? notification.content_id : "",
        contentDetail: notification.product
          ? notification.product.content_type.name
          : "",
        maturityLevel: notification.product
          ? notification.product.maturity_level.title
          : "",
      },
      apns: {
        payload: payload,
        fcm_options: {
          image: sample400,
        },
      },
    };

    const response = await admin.messaging().send(mess);

    console.log("FCM Response:", response);
  } catch (error) {
    console.error("Error sending message to FCM:", error);
    throw error;
  }
}
