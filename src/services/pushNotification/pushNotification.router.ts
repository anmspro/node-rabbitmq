// import {MainRouter} from '../../core/app/main.router';
// import * as pushNotificationController from './pushNotification.controller';
// import {validateToken} from '../../middleware/jwtCheck.middleware';

// export class PushNotificationRouter extends MainRouter {
//   constructor() {
//     super('pushNotification');
//   }
//   onInit(): void {
//     // this.router.route('/').get(validateToken(), vuDrmController.checkRoute);
//     this.router
//       .route('/send')
//       .get(validateToken(), pushNotificationController.sendPushNotification);
//     this.router
//       .route('/status/:id')
//       .put(
//         validateToken(),
//         pushNotificationController.updatePushNotificationStatusById
//       );
//     this.router.route('/push').get(pushNotificationController.sendPush);

//     // this.router.route('/syncTopic').get(pushNotificationController.syncTopic);
//     // this.router
//     //   .route('/sendTopicMessage')
//     //   .get(pushNotificationController.sendTopicMessage);
//     this.router
//       .route('/syncTokens')
//       .post(validateToken(), pushNotificationController.syncTokens);
//   }
// }
