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

    const sampleToken =
      "fTojy0jESYaopNrVx_0Rh1:APA91bEkIFUupN3HsvtGiTFLtnUVc0px160kKw_uxbtPcmU1h4aHOPSdZh4im6o8koP3cC8TTfRkkq4pcCaie4I-lALIlMmuoobndNPCsgndhaJTGNGCjSdjz2f9WjXPdDEiSjmv57fO";

    const rToken =
      "dndIW6-9QUCGxN2IvgMkLr:APA91bE7jUiXwswAPem8uiDnKd5EAhALiJkdVkJvhR5On9WJsaKZ2WQKfaQelZbKdksZ4Er87mrXUS9c1hx1oyaimPUGo3jr7yVXskSHmRSSOxkKbv7EMamXjfrsMgKRS_TWiYIpW8eh";

    const aToken =
      "dPy_D87QSGKjpLjBAx3VkF:APA91bHr9v8bU8M6a2WYR1ca1aWaPgGAfIGC_UDA58oZk2bL13bWwPLjGB4BqMzE5vsKxCaj2dTKLFakVGF7NSqCLoTQd7PSHwIcyB4Ljg51MBglY4zTYc9sQmx2PysjgqMOSgoLUXl8";

    const myToken =
      "fZP5yznO8E_mguZcMZHnFx:APA91bHLE4Sj4uzDJIMYZ57dF1jalngp7Gyl1uMZDTJ9DByZ29G8KzuzUA_gO8KCCI6CZ2G_ZoSY9CcsiATtFg8yQwZWKBw4uEK35FE_is_w42NRF3KGO8onDal3lVA2bQCnfzvma8Du";

    const sampleImage =
      "https://web-api.binge.buzz/uploads/tv_channel_logo/thumbs/6PxdRuTNuTkq9qxtB1ta8XJWfjMb1iBGgH_162x162.webp";

    // const message = {
    //   notification: {
    //     title: notification.title,
    //     body: notification.body,
    //     // image: `https://web-api.binge.buzz/${notification.image_url}`,
    //     image: sampleImage,
    //   },
    //   android: {
    //     notification: {
    //       imageUrl: sampleImage,
    //     },
    //   },
    //   apns: {
    //     payload: {
    //       aps: {
    //         alert: {
    //           title: notification.title,
    //           body: notification.body,
    //           image: sampleImage,
    //         },
    //         sound: "default",
    //         mutable_content: 1,
    //       },
    //     },
    //     fcm_options: {
    //       image: sampleImage,
    //     },
    //   },
    //   token: myToken,
    // };

    // const response = await admin.messaging().send(message);

    // existing solution sample for ios
    const payload = {
      aps: {
        alert: {
          title: notification.title,
          subtitle: "Subtitle",
          body: notification.body,
          image: sampleImage,
        },
        sound: "default",
        mutable_content: 1,
        data: {
          attachmentUrl: sampleImage,
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
      token: myToken,
      notification: {
        title: notification.title,
        body: notification.body,
        // image: `https://web-api.binge.buzz/${notification.image_url}`,
        image: sampleImage,
      },
      apns: {
        payload: payload,
        fcm_options: {
          image: sampleImage,
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
