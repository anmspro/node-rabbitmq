// /* eslint-disable @typescript-eslint/camelcase */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import * as model from './pushNotification.model';
// import * as customerModel from '../customer/customer.model';
// import * as notificationService from '../notification/notification.service';
// import {
//   // FcmNotificationSend,
//   NotificationSend,
//   // FcmNotificationSendAPN,
//   FcmNotificationSendWithPayload,
//   FcmNotificationSendAPNWithPayload,
//   SubscribeToTopic,
//   FcmNotificationSendByTopic,
//   UnSubscribeFromTopic
// } from '../../helper/utils/fcm.utils';
// // import * as config from 'config';
// // import {winstonWarn} from '../../helper/logger/log';
// // import {v4 as uuidv4} from 'uuid';
// // import * as ip from 'ip';
// import * as CustNotificationBlockModel from '../customerNotificationBlock/customerNotificationBlock.model';
// // import { retrySubscriptionsRenewWithDob } from '../subscription/subscription.service';
// import {RedisAsync} from '../../helper/utils/redis.utils';

// // try retry renew
// const sleep = (milliseconds): any => {
//   return new Promise((resolve) => setTimeout(resolve, milliseconds));
// };

// export const sendPushNotification = async (scheduleRunTime): Promise<any> => {
//   try {
//     // const ipAddress = `${process.env.INSTANCE_ID + '-' + ip.address()}`;
//     // const uuidStart = uuidv4();

//     // winstonWarn('SendPushNotification', 'START', ipAddress, '', uuidStart);

//     const limit = 50000;
//     let offset = 0 * limit;
//     let toSendNotification = await model.sendPushNotification(
//       scheduleRunTime,
//       offset,
//       limit
//     );
//     // console.log('To Send Notification --> ' + toSendNotification.length);
//     // winstonWarn(
//     //   'SendPushNotification',
//     //   'COUNT-O', 15736 - 10300
//     //   ipAddress,
//     //   toSendNotification.length,
//     //   uuidStart
//     // );
//     // console.log(toSendNotification);

//     for (let i = 0; toSendNotification.length > 0; ) {
//       // console.log(
//       //   i + ' -------> ' + offset + ' -------> ' + toSendNotification.length
//       // );
//       // winstonWarn(
//       //   'SendPushNotification',
//       //   'COUNT',
//       //   ipAddress,
//       //   toSendNotification.length,
//       //   uuidStart
//       // );
//       // let j = (i - 1) * limit;
//       toSendNotification.forEach(async (eachToTry) => {
//         // console.log('iteration number --> ' + j++);
//         // const uuidEach = uuidv4();
//         // winstonWarn(
//         //   'EachPushNotification',
//         //   'START',
//         //   ipAddress,
//         //   eachToTry,
//         //   uuidEach
//         // );
//         const currentDate = new Date();

//         if (eachToTry.customer == null) {
//           // winstonWarn(
//           //   'EachPushNotification',
//           //   'RESPONSE',
//           //   ipAddress,
//           //   {REMARKS: 'customer not found by phone'},
//           //   uuidEach
//           // );
//           // const res = await model.updatePushNotification(eachToTry.id, {
//           //   // eslint-disable-next-line @typescript-eslint/camelcase
//           //   status_id: 5,
//           //   remarks: 'customer not found by phone',
//           //   // eslint-disable-next-line @typescript-eslint/camelcase
//           //   updated_at: currentDate
//           // });
//           // console.log('Push Notification Update --> ' + JSON.stringify(res));
//           // return;
//           return await new Promise((resolve, _reject) => {
//             model
//               .updatePushNotification(eachToTry.id, {
//                 // eslint-disable-next-line @typescript-eslint/camelcase
//                 status_id: 5,
//                 remarks: 'customer not found by phone',
//                 // eslint-disable-next-line @typescript-eslint/camelcase
//                 updated_at: currentDate
//               })
//               .then(function(response: any) {
//                 // console.log('Successfully sent message:', response);
//                 resolve(response);
//               })
//               .catch(function(error: any) {
//                 console.log('Error message:', error);
//                 // reject(error);
//               });
//             // console.log('Push Notification Update --> ' + JSON.stringify(res));
//           });
//         } else {
//           const customerId = eachToTry.customer.id;
//           const customerFirebaseToken = eachToTry.customer.firebase_token;
//           if (!customerFirebaseToken || !customerFirebaseToken.trim()) {
//             // winstonWarn(
//             //   'EachPushNotification',
//             //   'RESPONSE',
//             //   ipAddress,
//             //   {REMARKS: 'firebase token not found'},
//             //   uuidEach
//             // );
//             // const res = await model.updatePushNotification(eachToTry.id, {
//             //   // eslint-disable-next-line @typescript-eslint/camelcase
//             //   customer_id: customerId,
//             //   // eslint-disable-next-line @typescript-eslint/camelcase
//             //   status_id: 5,
//             //   remarks: 'firebase token not found',
//             //   // eslint-disable-next-line @typescript-eslint/camelcase
//             //   updated_at: currentDate
//             // });
//             // console.log('Push Notification Update --> ' + JSON.stringify(res));
//             // return;
//             return await new Promise((resolve, _reject) => {
//               model
//                 .updatePushNotification(eachToTry.id, {
//                   // eslint-disable-next-line @typescript-eslint/camelcase
//                   customer_id: customerId,
//                   // eslint-disable-next-line @typescript-eslint/camelcase
//                   status_id: 5,
//                   remarks: 'firebase token not found',
//                   // eslint-disable-next-line @typescript-eslint/camelcase
//                   updated_at: currentDate
//                 })
//                 .then(function(response: any) {
//                   // console.log('Successfully sent message:', response);
//                   resolve(response);
//                 })
//                 .catch(function(error: any) {
//                   console.log('Error message:', error);
//                   // reject(error);
//                 });
//               // console.log('Push Notification Update --> ' + JSON.stringify(res));
//             });
//           } else {
//             if (eachToTry.customer.notificationPreference.length) {
//               // winstonWarn(
//               //   'EachPushNotification',
//               //   'RESPONSE',
//               //   ipAddress,
//               //   {REMARKS: 'disabled by customer'},
//               //   uuidEach
//               // );
//               // const res = await model.updatePushNotification(eachToTry.id, {
//               //   // eslint-disable-next-line @typescript-eslint/camelcase
//               //   customer_id: customerId,
//               //   // eslint-disable-next-line @typescript-eslint/camelcase
//               //   status_id: 5,
//               //   remarks: 'disabled by customer',
//               //   // eslint-disable-next-line @typescript-eslint/camelcase
//               //   updated_at: currentDate
//               // });
//               // console.log('Push Notification Update --> ' + JSON.stringify(res));
//               // return;
//               return await new Promise((resolve, _reject) => {
//                 model
//                   .updatePushNotification(eachToTry.id, {
//                     // eslint-disable-next-line @typescript-eslint/camelcase
//                     customer_id: customerId,
//                     // eslint-disable-next-line @typescript-eslint/camelcase
//                     status_id: 5,
//                     remarks: 'disabled by customer',
//                     // eslint-disable-next-line @typescript-eslint/camelcase
//                     updated_at: currentDate
//                   })
//                   .then(function(response: any) {
//                     // console.log('Successfully sent message:', response);
//                     resolve(response);
//                   })
//                   .catch(function(error: any) {
//                     console.log('Error message:', error);
//                     // reject(error);
//                   });
//                 // console.log('Push Notification Update --> ' + JSON.stringify(res));
//               });
//             } else {
//               // const payload = {
//               //   notification: {
//               //     title: eachToTry.title,
//               //     body: eachToTry.body
//               //   },
//               //   data: {
//               //     title: eachToTry.title,
//               //     body: eachToTry.body,
//               //     imageUrl: eachToTry.image_url,
//               //     notificationTypeId: eachToTry.notification_type_id.toString()
//               //   }
//               // };
//               // const unreadCount = await notificationService.UnreadNotificationsCountByCustId(
//               //   customerId,
//               //   eachToTry.device_type
//               // );
//               // console.log('Unread Notifications Count --> ' + unreadCount);
//               let unreadCount = 0;
//               await new Promise((resolve, _reject) => {
//                 notificationService
//                   .UnreadNotificationsCountByCustId(
//                     customerId,
//                     eachToTry.device_type
//                   )
//                   .then(function(response: any) {
//                     // console.log('Successfully sent message:', response);
//                     unreadCount = response;
//                     resolve(response);
//                   })
//                   .catch(function(error: any) {
//                     console.log('Error message:', error);
//                     // reject(error);
//                   });
//                 // console.log('Push Notification Update --> ' + JSON.stringify(res));
//               });
//               // console.log('Unread Notifications Count --> ' + unreadCount);
//               // winstonWarn(
//               //   'EachPushNotification',
//               //   'UNREADCOUNT',
//               //   ipAddress,
//               //   unreadCount,
//               //   uuidEach
//               // );

//               const payload = {
//                 // notification: {
//                 //   title: eachToTry.title,
//                 //   body: eachToTry.body,
//                 //   clickAction: eachToTry.click_action ? eachToTry.click_action : '',
//                 //   badge: unreadCount ? unreadCount.toString() : '0'
//                 // },
//                 data: {
//                   appName: 'binge',
//                   title: eachToTry.title,
//                   body: eachToTry.body,
//                   clickAction: eachToTry.click_action
//                     ? eachToTry.click_action
//                     : '',
//                   contentType: eachToTry.content_type
//                     ? eachToTry.content_type
//                     : '',
//                   contentId: eachToTry.content_id
//                     ? eachToTry.content_id.toString()
//                     : '',
//                   contentDetail: eachToTry.product
//                     ? eachToTry.product.content_type.name
//                     : '',
//                   maturityLevel: eachToTry.product
//                     ? eachToTry.product.maturity_level.title
//                     : '',
//                   imageUrl: eachToTry.image_url ? eachToTry.image_url : '',
//                   badge: unreadCount ? unreadCount.toString() : '0',
//                   fcmId: eachToTry.id.toString()
//                   // notificationTypeId: eachToTry.notification_type_id.toString()
//                 }
//               };
//               // console.log(payload);
//               const options = {
//                 priority: eachToTry.priority,
//                 ttl: 86400 //60 * 60 * 24
//                 // analyticsLabel: 'labelTest'
//               };
//               // winstonWarn(
//               //   'EachPushNotification',
//               //   'PAYLOAD',
//               //   ipAddress,
//               //   payload,
//               //   uuidEach
//               // );

//               if (eachToTry.device_type == 'tv') {
//                 // winstonWarn(
//                 //   'EachPushNotification',
//                 //   'RESPONSE',
//                 //   ipAddress,
//                 //   {REMARKS: 'Notification set for TV device'},
//                 //   uuidEach
//                 // );
//                 // console.log(fcmRes.results[0].error.errorInfo.code);
//                 // const res = await model.updatePushNotification(eachToTry.id, {
//                 //   // eslint-disable-next-line @typescript-eslint/camelcase
//                 //   customer_id: customerId,
//                 //   // eslint-disable-next-line @typescript-eslint/camelcase
//                 //   status_id: 5,
//                 //   remarks: 'Notification set for TV device',
//                 //   // eslint-disable-next-line @typescript-eslint/camelcase
//                 //   updated_at: currentDate
//                 // });
//                 // console.log('Push Notification Update --> ' + JSON.stringify(res));
//                 await new Promise((resolve, _reject) => {
//                   model
//                     .updatePushNotification(eachToTry.id, {
//                       // eslint-disable-next-line @typescript-eslint/camelcase
//                       customer_id: customerId,
//                       // eslint-disable-next-line @typescript-eslint/camelcase
//                       status_id: 5,
//                       remarks: 'Notification set for TV device',
//                       // eslint-disable-next-line @typescript-eslint/camelcase
//                       updated_at: currentDate
//                     })
//                     .then(function(response: any) {
//                       // console.log('Successfully sent message:', response);
//                       resolve(response);
//                     })
//                     .catch(function(error: any) {
//                       console.log('Error message:', error);
//                       // reject(error);
//                     });
//                   // console.log('Push Notification Update --> ' + JSON.stringify(res));
//                 });
//               } else {
//                 const fcmRes = await FcmNotificationSendWithPayload(
//                   customerFirebaseToken,
//                   payload,
//                   options
//                 );
//                 // console.log('FCMRESPONSE --> ' + JSON.stringify(fcmRes));
//                 // winstonWarn(
//                 //   'EachPushNotification',
//                 //   'FCMRESPONSE',
//                 //   ipAddress,
//                 //   fcmRes,
//                 //   uuidEach
//                 // );

//                 if (fcmRes.successCount) {
//                   // const res = await model.updatePushNotification(eachToTry.id, {
//                   //   // eslint-disable-next-line @typescript-eslint/camelcase
//                   //   customer_id: customerId,
//                   //   // eslint-disable-next-line @typescript-eslint/camelcase
//                   //   status_id: 4,
//                   //   messageId: fcmRes.results[0].messageId,
//                   //   multicastId: fcmRes.multicastId,
//                   //   remarks: 'success',
//                   //   // eslint-disable-next-line @typescript-eslint/camelcase
//                   //   updated_at: currentDate
//                   // });
//                   // console.log('Push Notification Update --> ' + JSON.stringify(res));
//                   await new Promise((resolve, _reject) => {
//                     model
//                       .updatePushNotification(eachToTry.id, {
//                         // eslint-disable-next-line @typescript-eslint/camelcase
//                         customer_id: customerId,
//                         // eslint-disable-next-line @typescript-eslint/camelcase
//                         status_id: 4,
//                         messageId: fcmRes.results[0].messageId,
//                         multicastId: fcmRes.multicastId,
//                         remarks: 'success',
//                         // eslint-disable-next-line @typescript-eslint/camelcase
//                         updated_at: currentDate
//                       })
//                       .then(function(response: any) {
//                         // console.log('Successfully sent message:', response);
//                         resolve(response);
//                       })
//                       .catch(function(error: any) {
//                         console.log('Error message:', error);
//                         // reject(error);
//                       });
//                     // console.log('Push Notification Update --> ' + JSON.stringify(res));
//                   });
//                 } else {
//                   // console.log(fcmRes.results[0].error.errorInfo.code);
//                   // const res = await model.updatePushNotification(eachToTry.id, {
//                   //   // eslint-disable-next-line @typescript-eslint/camelcase
//                   //   customer_id: customerId,
//                   //   // eslint-disable-next-line @typescript-eslint/camelcase
//                   //   status_id: 5,
//                   //   multicastId: fcmRes.multicastId,
//                   //   remarks: fcmRes.results[0].error.errorInfo.code,
//                   //   // eslint-disable-next-line @typescript-eslint/camelcase
//                   //   updated_at: currentDate
//                   // });
//                   // console.log('Push Notification Update --> ' + JSON.stringify(res));
//                   await new Promise((resolve, _reject) => {
//                     model
//                       .updatePushNotification(eachToTry.id, {
//                         // eslint-disable-next-line @typescript-eslint/camelcase
//                         customer_id: customerId,
//                         // eslint-disable-next-line @typescript-eslint/camelcase
//                         status_id: 5,
//                         multicastId: fcmRes.multicastId,
//                         remarks: fcmRes.results[0].error.errorInfo.code,
//                         // eslint-disable-next-line @typescript-eslint/camelcase
//                         updated_at: currentDate
//                       })
//                       .then(function(response: any) {
//                         // console.log('Successfully sent message:', response);
//                         resolve(response);
//                       })
//                       .catch(function(error: any) {
//                         console.log('Error message:', error);
//                         // reject(error);
//                       });
//                     // console.log('Push Notification Update --> ' + JSON.stringify(res));
//                   });

//                   if (
//                     fcmRes.results[0].error.errorInfo.code ==
//                     'messaging/registration-token-not-registered'
//                   ) {
//                     // const cRes = await customerModel.customerUpdate({
//                     //   id: customerId,
//                     //   data: {
//                     //     // eslint-disable-next-line @typescript-eslint/camelcase
//                     //     firebase_token: null,
//                     //     // eslint-disable-next-line @typescript-eslint/camelcase
//                     //     updated_at: new Date()
//                     //   }
//                     // });
//                     // console.log('Customer Update --> ' + JSON.stringify(cRes));
//                     await new Promise((resolve, _reject) => {
//                       customerModel
//                         .customerUpdate({
//                           id: customerId,
//                           data: {
//                             // eslint-disable-next-line @typescript-eslint/camelcase
//                             firebase_token: null,
//                             // eslint-disable-next-line @typescript-eslint/camelcase
//                             updated_at: new Date()
//                           }
//                         })
//                         .then(function(response: any) {
//                           // console.log('Successfully sent message:', response);
//                           resolve(response);
//                         })
//                         .catch(function(error: any) {
//                           console.log('Error message:', error);
//                           // reject(error);
//                         });
//                       // console.log('Push Notification Update --> ' + JSON.stringify(res));
//                     });
//                   }
//                 }
//               }

//               // const res = await notificationService.storeNotificationForCustId({
//               //   // eslint-disable-next-line @typescript-eslint/camelcase
//               //   customer_id: customerId,
//               //   to: customerFirebaseToken,
//               //   // eslint-disable-next-line @typescript-eslint/camelcase
//               //   device_type: eachToTry.device_type,
//               //   // message: JSON.stringify(payload),
//               //   message: payload,
//               //   type: 'fcm',
//               //   // eslint-disable-next-line @typescript-eslint/camelcase
//               //   read_status: 0
//               // });
//               // console.log('Notification Store --> ' + JSON.stringify(res));
//               await new Promise((resolve, _reject) => {
//                 notificationService
//                   .storeNotificationForCustId({
//                     // eslint-disable-next-line @typescript-eslint/camelcase
//                     customer_id: customerId,
//                     to: customerFirebaseToken,
//                     // eslint-disable-next-line @typescript-eslint/camelcase
//                     device_type: eachToTry.device_type,
//                     // message: JSON.stringify(payload),
//                     message: payload,
//                     type: 'fcm',
//                     // eslint-disable-next-line @typescript-eslint/camelcase
//                     read_status: 0
//                   })
//                   .then(function(response: any) {
//                     // console.log('Successfully sent message:', response);
//                     resolve(response);
//                   })
//                   .catch(function(error: any) {
//                     console.log('Error message:', error);
//                     // reject(error);
//                   });
//                 // console.log('Push Notification Update --> ' + JSON.stringify(res));
//               });
//               // winstonWarn(
//               //   'EachPushNotification',
//               //   'END',
//               //   ipAddress,
//               //   eachToTry,
//               //   uuidEach
//               // );
//             }
//           }
//         }
//       });
//       // await sleep(5000).then(async () => {
//       // console.log('waiting --> ' + new Date());
//       i = i + 1;
//       offset = i * limit;
//       // toSendNotification = await model.sendPushNotification(
//       //   scheduleRunTime,
//       //   offset,
//       //   limit
//       // );
//       // await model
//       //   .sendPushNotification(scheduleRunTime, offset, limit)
//       //   .then((c) => {
//       //     toSendNotification = c;
//       //   });
//       // console.log('To Send Notification --> ' + toSendNotification.length);
//       await new Promise((resolve, _reject) => {
//         model
//           .sendPushNotification(scheduleRunTime, offset, limit)
//           .then(function(response: any) {
//             // console.log('Successfully sent message:', response);
//             toSendNotification = response;
//             resolve(response);
//           })
//           .catch(function(error: any) {
//             console.log('Error message:', error);
//             // reject(error);
//           });
//         // console.log('Push Notification Update --> ' + JSON.stringify(res));
//       });
//       // console.log('Push Notification Update --> ' + toSendNotification.length);
//       // console.log(
//       //   i + ' -------> ' + offset + ' -------> ' + toSendNotification.length
//       // );
//       // });
//     }

//     return {
//       isSuccess: true,
//       message: 'complete'
//     };
//   } catch (error) {
//     return {
//       isSuccess: false,
//       message: error
//     };
//   }
// };

// export const sendPushNotificationAllOnce = async (
//   scheduleRunTime
// ): Promise<any> => {
//   try {
//     const limit = 50000;
//     const offset = 0;
//     const toSendNotification = await model.sendPushNotification(
//       scheduleRunTime,
//       offset,
//       limit
//     );
//     console.log('toSendNotification.length: ', toSendNotification.length);
//     while (toSendNotification.length > 0) {
//       let noOfTried = 0;
//       for (let i = 0; i < toSendNotification.length; i++) {
//         noOfTried++;
//         if (noOfTried > 1000) {
//           break;
//         } else {
//           const eachToTry = toSendNotification.shift();
//           const currentDate = new Date();

//           if (eachToTry.customer == null) {
//             await new Promise((resolve, _reject) => {
//               model
//                 .updatePushNotification(eachToTry.id, {
//                   // eslint-disable-next-line @typescript-eslint/camelcase
//                   status_id: 5,
//                   remarks: 'customer not found by phone',
//                   // eslint-disable-next-line @typescript-eslint/camelcase
//                   updated_at: currentDate
//                 })
//                 .then(function(response: any) {
//                   // console.log('eachToTry.customer == null:', response);
//                   resolve(response);
//                 })
//                 .catch(function(error: any) {
//                   console.log('Error message:', error);
//                   // reject(error);
//                 });
//             });
//           } else {
//             const customerId = eachToTry.customer.id;
//             const customerFirebaseToken = eachToTry.customer.firebase_token;
//             if (!customerFirebaseToken || !customerFirebaseToken.trim()) {
//               await new Promise((resolve, _reject) => {
//                 model
//                   .updatePushNotification(eachToTry.id, {
//                     // eslint-disable-next-line @typescript-eslint/camelcase
//                     customer_id: customerId,
//                     // eslint-disable-next-line @typescript-eslint/camelcase
//                     status_id: 5,
//                     remarks: 'firebase token not found',
//                     // eslint-disable-next-line @typescript-eslint/camelcase
//                     updated_at: currentDate
//                   })
//                   .then(function(response: any) {
//                     // console.log(
//                     //   '!customerFirebaseToken || !customerFirebaseToken.trim(): ',
//                     //   response
//                     // );
//                     resolve(response);
//                   })
//                   .catch(function(error: any) {
//                     console.log('Error message:', error);
//                     // reject(error);
//                   });
//                 // console.log('Push Notification Update --> ' + JSON.stringify(res));
//               });
//             } else {
//               if (eachToTry.customer.notificationPreference.length) {
//                 await new Promise((resolve, _reject) => {
//                   model
//                     .updatePushNotification(eachToTry.id, {
//                       // eslint-disable-next-line @typescript-eslint/camelcase
//                       customer_id: customerId,
//                       // eslint-disable-next-line @typescript-eslint/camelcase
//                       status_id: 5,
//                       remarks: 'disabled by customer',
//                       // eslint-disable-next-line @typescript-eslint/camelcase
//                       updated_at: currentDate
//                     })
//                     .then(function(response: any) {
//                       // console.log(
//                       //   'eachToTry.customer.notificationPreference.length: ',
//                       //   response
//                       // );
//                       resolve(response);
//                     })
//                     .catch(function(error: any) {
//                       console.log('Error message:', error);
//                       // reject(error);
//                     });
//                 });
//               } else {
//                 let unreadCount = 0;
//                 await new Promise((resolve, _reject) => {
//                   notificationService
//                     .UnreadNotificationsCountByCustId(
//                       customerId,
//                       eachToTry.device_type
//                     )
//                     .then(function(response: any) {
//                       // console.log(
//                       //   'UnreadNotificationsCountByCustId: ',
//                       //   response
//                       // );
//                       unreadCount = response;
//                       resolve(response);
//                     })
//                     .catch(function(error: any) {
//                       console.log('Error message:', error);
//                       // reject(error);
//                     });
//                 });

//                 const payload = {
//                   data: {
//                     appName: 'binge',
//                     title: eachToTry.title,
//                     body: eachToTry.body,
//                     clickAction: eachToTry.click_action
//                       ? eachToTry.click_action
//                       : '',
//                     contentType: eachToTry.content_type
//                       ? eachToTry.content_type
//                       : '',
//                     contentId: eachToTry.content_id
//                       ? eachToTry.content_id.toString()
//                       : '',
//                     contentDetail: eachToTry.product
//                       ? eachToTry.product.content_type.name
//                       : '',
//                     maturityLevel: eachToTry.product
//                       ? eachToTry.product.maturity_level.title
//                       : '',
//                     imageUrl: eachToTry.image_url ? eachToTry.image_url : '',
//                     badge: unreadCount ? unreadCount.toString() : '0',
//                     fcmId: eachToTry.id.toString()
//                     // notificationTypeId: eachToTry.notification_type_id.toString()
//                   }
//                 };
//                 const options = {
//                   priority: eachToTry.priority,
//                   ttl: 86400 //60 * 60 * 24
//                 };

//                 await new Promise((resolve, _reject) => {
//                   notificationService
//                     .storeNotificationForCustId({
//                       // eslint-disable-next-line @typescript-eslint/camelcase
//                       customer_id: customerId,
//                       to: customerFirebaseToken,
//                       // eslint-disable-next-line @typescript-eslint/camelcase
//                       device_type: eachToTry.device_type,
//                       // message: JSON.stringify(payload),
//                       message: payload,
//                       type: 'fcm',
//                       // eslint-disable-next-line @typescript-eslint/camelcase
//                       read_status: 0
//                     })
//                     .then(function(response: any) {
//                       // console.log('storeNotificationForCustId: ', response);
//                       resolve(response);
//                     })
//                     .catch(function(error: any) {
//                       console.log('Error message:', error);
//                       // reject(error);
//                     });
//                 });

//                 if (eachToTry.device_type == 'tv') {
//                   await new Promise((resolve, _reject) => {
//                     model
//                       .updatePushNotification(eachToTry.id, {
//                         // eslint-disable-next-line @typescript-eslint/camelcase
//                         customer_id: customerId,
//                         // eslint-disable-next-line @typescript-eslint/camelcase
//                         status_id: 5,
//                         remarks: 'Notification set for TV device',
//                         // eslint-disable-next-line @typescript-eslint/camelcase
//                         updated_at: currentDate
//                       })
//                       .then(function(response: any) {
//                         // console.log('eachToTry.device_type == tv: ', response);
//                         resolve(response);
//                       })
//                       .catch(function(error: any) {
//                         console.log('Error message:', error);
//                         // reject(error);
//                       });
//                   });
//                 } else {
//                   let fcmRes;
//                   await FcmNotificationSendWithPayload(
//                     customerFirebaseToken,
//                     payload,
//                     options
//                   )
//                     .then((c) => {
//                       fcmRes = c;
//                     })
//                     .catch(function(error: any) {
//                       console.log('Error message:', error);
//                       // reject(error);
//                     });
//                   // console.log('fcmRes', fcmRes);
//                   if (fcmRes.successCount) {
//                     await new Promise((resolve, _reject) => {
//                       model
//                         .updatePushNotification(eachToTry.id, {
//                           // eslint-disable-next-line @typescript-eslint/camelcase
//                           customer_id: customerId,
//                           // eslint-disable-next-line @typescript-eslint/camelcase
//                           status_id: 4,
//                           messageId: fcmRes.results[0].messageId,
//                           multicastId: fcmRes.multicastId,
//                           remarks: 'success',
//                           // eslint-disable-next-line @typescript-eslint/camelcase
//                           updated_at: currentDate
//                         })
//                         .then(function(response: any) {
//                           // console.log('fcmRes.successCount: ', response);
//                           resolve(response);
//                         })
//                         .catch(function(error: any) {
//                           console.log('Error message:', error);
//                           // reject(error);
//                         });
//                     });
//                   } else {
//                     await new Promise((resolve, _reject) => {
//                       model
//                         .updatePushNotification(eachToTry.id, {
//                           // eslint-disable-next-line @typescript-eslint/camelcase
//                           customer_id: customerId,
//                           // eslint-disable-next-line @typescript-eslint/camelcase
//                           status_id: 5,
//                           multicastId: fcmRes.multicastId,
//                           remarks: fcmRes.results[0].error.errorInfo.code,
//                           // eslint-disable-next-line @typescript-eslint/camelcase
//                           updated_at: currentDate
//                         })
//                         .then(function(response: any) {
//                           // console.log('fcmRes.failed: ', response);
//                           resolve(response);
//                         })
//                         .catch(function(error: any) {
//                           console.log('Error message:', error);
//                           // reject(error);
//                         });
//                     });

//                     // if (
//                     //   fcmRes.results[0].error.errorInfo.code ==
//                     //   'messaging/registration-token-not-registered'
//                     // ) {
//                     //   await new Promise((resolve, _reject) => {
//                     //     customerModel
//                     //       .customerUpdate({
//                     //         id: customerId,
//                     //         data: {
//                     //           // eslint-disable-next-line @typescript-eslint/camelcase
//                     //           firebase_token: null,
//                     //           // eslint-disable-next-line @typescript-eslint/camelcase
//                     //           updated_at: new Date()
//                     //         }
//                     //       })
//                     //       .then(function(response: any) {
//                     //         // console.log(
//                     //         //   'messaging/registration-token-not-registered: ',
//                     //         //   response
//                     //         // );
//                     //         resolve(response);
//                     //       })
//                     //       .catch(function(error: any) {
//                     //         console.log('Error message:', error);
//                     //         // reject(error);
//                     //       });
//                     //   });
//                     // }
//                   }
//                 }
//               }
//             }
//           }
//         }
//       }
//       await sleep(5000).then(() => {
//         console.log(new Date() + '--> ' + noOfTried);
//       });
//       // offset = offset + limit;
//       // await new Promise((resolve, _reject) => {
//       //   model
//       //     .sendPushNotification(scheduleRunTime, offset, limit)
//       //     .then(function(response: any) {
//       //       // console.log('Successfully sent message:', response);
//       //       toSendNotification = response;
//       //       resolve(response);
//       //     })
//       //     .catch(function(error: any) {
//       //       console.log('Error message:', error);
//       //       // reject(error);
//       //     });
//       // });
//     }

//     return {
//       isSuccess: true,
//       message: 'complete'
//     };
//   } catch (error) {
//     return {
//       isSuccess: false,
//       message: error
//     };
//   }
// };

// export const saveNotification = async (eachToTry): Promise<any> => {
//   let unreadCount = 0;
//   await notificationService
//     .UnreadNotificationsCountByCustId(
//       eachToTry.customer.id,
//       eachToTry.device_type
//     )
//     .then(function(response: any) {
//       unreadCount = response;
//     })
//     .catch(function(error: any) {
//       console.log('UnreadNotificationsCountByCustId Error message:', error);
//       // reject(error);
//     });

//   const payload = {
//     data: {
//       appName: 'binge',
//       title: eachToTry.title,
//       body: eachToTry.body,
//       clickAction: eachToTry.click_action ? eachToTry.click_action : '',
//       contentType: eachToTry.content_type ? eachToTry.content_type : '',
//       contentId: eachToTry.content_id ? eachToTry.content_id.toString() : '',
//       contentDetail: eachToTry.product
//         ? eachToTry.product.content_type.name
//         : '',
//       maturityLevel: eachToTry.product
//         ? eachToTry.product.maturity_level.title
//         : '',
//       imageUrl: eachToTry.image_url ? eachToTry.image_url : '',
//       badge: unreadCount ? unreadCount.toString() : '0',
//       fcmId: eachToTry.id.toString()
//     }
//   };

//   await notificationService
//     .storeNotificationForCustId({
//       customer_id: eachToTry.customer.id,
//       to: eachToTry.customer?.firebase_token,
//       device_type: eachToTry.device_type,
//       message: payload,
//       type: 'fcm',
//       read_status: 0
//     })
//     .catch(function(error: any) {
//       console.log('storeNotificationForCustId Error message:', error);
//       // reject(error);
//     });

//   return unreadCount;
// };

// export const updatePushNotification = async (
//   eachToTry,
//   remarks?
// ): Promise<any> => {
//   await model
//     .updatePushNotification(eachToTry.id, {
//       customer_id: eachToTry?.customer?.id,
//       status_id: 5,
//       remarks: remarks,
//       updated_at: new Date()
//     })
//     .catch(function(error: any) {
//       console.log('updatePushNotification Error message:', error);
//       // reject(error);
//     });
// };

// export const sendPushNotificationWithoutPromise = async (
//   scheduleRunTime,
//   instanceId
// ): Promise<any> => {
//   try {
//     const limit = 7500;
//     // const offset = 0;
//     const offset = instanceId * limit;
//     const toSendNotification = await model.sendPushNotification(
//       scheduleRunTime,
//       offset,
//       limit
//     );
//     console.log(
//       'instanceId: ' +
//         instanceId +
//         ' --> toSendNotification.length: ' +
//         toSendNotification.length
//     );
//     while (toSendNotification.length > 0) {
//       let noOfTried = 0;
//       for (let i = 0; i < toSendNotification.length; i++) {
//         noOfTried++;
//         if (noOfTried > 1000) {
//           break;
//         }

//         const eachToTry = toSendNotification.shift();
//         const currentDate = new Date();

//         if (eachToTry.customer == null) {
//           await updatePushNotification(
//             eachToTry,
//             'customer not found by phone'
//           );

//           continue;
//         }

//         const options = {
//           priority: eachToTry.priority,
//           ttl: 86400 //60 * 60 * 24
//         };

//         if (eachToTry.image_url == 'topic') {
//           eachToTry.image_url = null;
//           if (eachToTry.notification_type_id == 3) {
//             console.log('content topic');
//             await FcmNotificationSendByTopic(
//               'ContentTopicFinal',
//               eachToTry,
//               0,
//               options
//             );
//           } else {
//             console.log('Subscription topic');
//             await FcmNotificationSendByTopic(
//               'SubscriptionTopicFinal',
//               eachToTry,
//               0,
//               options
//             );
//           }

//           await updatePushNotification(
//             eachToTry,
//             'Topic notification was sent'
//           );

//           continue;
//         }

//         const customerId = eachToTry.customer.id;
//         const customerFirebaseToken = eachToTry.customer.firebase_token;
//         if (!customerFirebaseToken || !customerFirebaseToken.trim()) {
//           await updatePushNotification(eachToTry, 'firebase token not found');

//           await saveNotification(eachToTry);

//           continue;
//         }

//         if (eachToTry.customer.notificationPreference.length) {
//           await updatePushNotification(eachToTry, 'disabled by customer');

//           continue;
//         }

//         const unreadCount = await saveNotification(eachToTry);

//         const osType = eachToTry.customer.os_type == 'ios' ? 'ios' : 'android';

//         if (eachToTry.device_type == 'tv') {
//           await updatePushNotification(
//             eachToTry,
//             'Notification set for TV device'
//           );
//         } else {
//           await NotificationSend(
//             customerFirebaseToken,
//             eachToTry,
//             options,
//             unreadCount,
//             osType
//           )
//             .then(async (fcmRes) => {
//               let isSuccess = false;
//               let messageId = '';
//               let multicastId = '';
//               let remarks = '';
//               if (osType == 'ios') {
//                 isSuccess = Object.prototype.hasOwnProperty.call(
//                   fcmRes,
//                   'errorInfo'
//                 )
//                   ? false
//                   : true;
//               } else {
//                 isSuccess = fcmRes.successCount ? true : false;
//                 multicastId = fcmRes.multicastId;
//                 messageId = isSuccess ? fcmRes.results[0].messageId : '';
//                 remarks = isSuccess
//                   ? ''
//                   : fcmRes.results[0].error.errorInfo.code;
//               }
//               // if (fcmRes.successCount) {
//               if (isSuccess) {
//                 await model
//                   .updatePushNotification(eachToTry.id, {
//                     customer_id: customerId,
//                     status_id: 4,
//                     messageId: messageId,
//                     multicastId: multicastId,
//                     remarks: 'success',
//                     updated_at: currentDate
//                   })
//                   .catch(function(error: any) {
//                     console.log('updatePushNotification Error message:', error);
//                     // reject(error);
//                   });
//               } else {
//                 await model
//                   .updatePushNotification(eachToTry.id, {
//                     customer_id: customerId,
//                     status_id: 5,
//                     multicastId: multicastId,
//                     remarks: remarks,
//                     updated_at: currentDate
//                   })
//                   .catch(function(error: any) {
//                     console.log('updatePushNotification Error message:', error);
//                     // reject(error);
//                   });

//                 if (
//                   fcmRes.results[0].error.errorInfo.code ==
//                   'messaging/registration-token-not-registered'
//                 ) {
//                   await customerModel
//                     .customerUpdate({
//                       id: customerId,
//                       data: {
//                         firebase_token: null,
//                         updated_at: new Date()
//                       }
//                     })
//                     .catch(function(error: any) {
//                       console.log('customerUpdate Error message:', error);
//                       // reject(error);
//                     });
//                 }
//               }
//             })
//             .catch(function(error: any) {
//               console.log('FCM Error message:', error);
//               model
//                 .updatePushNotification(eachToTry.id, {
//                   customer_id: customerId,
//                   status_id: 5,
//                   multicastId: '',
//                   remarks: error.errorInfo.message
//                     ? error.errorInfo.message
//                     : 'exception',
//                   updated_at: currentDate
//                 })
//                 .catch(function(error: any) {
//                   console.log('updatePushNotification Error message:', error);
//                   // reject(error);
//                 });

//               customerModel
//                 .customerUpdate({
//                   id: customerId,
//                   data: {
//                     firebase_token: null,
//                     updated_at: new Date()
//                   }
//                 })
//                 .catch(function(error: any) {
//                   console.log('customerUpdate Error message:', error);
//                 });
//             });
//         }
//       }

//       await sleep(5000).then(() => {
//         console.log(new Date() + '--> ' + noOfTried);
//       });
//     }

//     return {
//       isSuccess: true,
//       message: 'complete'
//     };
//   } catch (error) {
//     return {
//       isSuccess: false,
//       message: error
//     };
//   }
// };

// export const updatePushNotificationStatusById = async (
//   id,
//   reqBody,
//   _devType
// ): Promise<any> => {
//   const currentTime = new Date();
//   const response = await model.updatePushNotification(id, {
//     // eslint-disable-next-line @typescript-eslint/camelcase
//     status_id: reqBody.status_id,
//     // eslint-disable-next-line @typescript-eslint/camelcase
//     updated_at: currentTime
//   });
//   if (response != null) {
//     return {
//       isSuccess: true,
//       message: 'Successfully updated'
//     };
//   } else {
//     return {
//       isSuccess: false,
//       message: 'Update fail'
//     };
//   }
// };

// export const sendPush = async (): Promise<any> => {
//   try {
//     console.log('sendPush');

//     const customerFirebaseToken =
//       'cOEF82U_mkWmrMtPp6s_0N:APA91bGFaMnQvtZLmyEiDWZycdKax9-0tBNPuo8Af1WiUBb_0pHYGRr9McUKkjmS4GfgUvKcr1sUPBNQnYEJWHqymPJrARP8fULOsjHT7N_QO0CMmjZpEN66gfa-tub2Qq81jCs3-Aw1';

//     let payload = {};
//     payload = {
//       data: {
//         appName: 'binge',
//         title: 'LinkVision',
//         body: 'APNS test alert body',
//         clickAction: 'open_subscription_activity',
//         contentType: 'none',
//         contentId: '',
//         contentDetail: 'Subscription',
//         maturityLevel: '',
//         imageUrl:
//           'uploads/pushNotification/yZtNNlMsi1q4xmc1CfzdA5DSYkO1QeTEsk.png',
//         badge: 3,
//         fcmId: '111111'
//         // notificationTypeId: eachToTry.notification_type_id.toString()
//       }
//     };
//     notificationService
//       .storeNotificationForCustId({
//         // eslint-disable-next-line @typescript-eslint/camelcase
//         customer_id: 124,
//         to: customerFirebaseToken,
//         // eslint-disable-next-line @typescript-eslint/camelcase
//         device_type: 'mobile',
//         // message: JSON.stringify(payload),
//         message: payload,
//         type: 'fcm',
//         // eslint-disable-next-line @typescript-eslint/camelcase
//         read_status: 0
//       })
//       .catch(function(error: any) {
//         console.log('storeNotificationForCustId Error message:', error);
//         // reject(error);
//       });
//     payload = {
//       // fcmOption: {
//       //   imageUrl:
//       //     'uploads/pushNotification/yZtNNlMsi1q4xmc1CfzdA5DSYkO1QeTEsk.png'
//       // },
//       aps: {
//         alert: {
//           title: 'LinkVision',
//           body: 'APNS test alert body'
//         },
//         badge: 3,
//         sound: 'default',
//         // eslint-disable-next-line @typescript-eslint/camelcase
//         mutable_content: 1
//       },
//       imageUrl:
//         'uploads/pushNotification/yZtNNlMsi1q4xmc1CfzdA5DSYkO1QeTEsk.png',
//       contentType: 'none',
//       pageToNavigate: 'open_subscription_activity',
//       contentId: '',
//       contentDetail: 'Subscription'
//     };

//     await FcmNotificationSendAPNWithPayload(customerFirebaseToken, payload)
//       .then(async (fcmRes) => {
//         console.log(fcmRes);
//       })
//       .catch(function(error: any) {
//         console.log('FCM Error message:', error);
//         // if (error.errorInfo) {
//         //   console.log('has error');
//         //   console.log(error.errorInfo.message);
//         // }
//         // reject(error);.error.errorInfo.code
//       });
//     // console.log('fcmRes', fcmRes);

//     return {
//       isSuccess: true,
//       message: 'complete'
//     };
//   } catch (error) {
//     return {
//       isSuccess: false,
//       message: error
//     };
//   }
// };

// export const unsubscribeTopic = async (blockedIds, topic): Promise<any> => {
//   const blockedTokens = await customerModel.getCustomersByIds(blockedIds);

//   let tokens: string[] = [];
//   let i = 0;
//   let j = 1;
//   while (i < blockedTokens.length) {
//     tokens.push(blockedTokens[i++]);

//     if (j % 1000 == 0 || j == blockedTokens.length) {
//       await UnSubscribeFromTopic(tokens, topic);
//       tokens = [];
//     }

//     j++;
//   }
// };

// export const syncTopic = async (scheduleRunTime?: any): Promise<any> => {
//   console.log('Schedule run time: ', scheduleRunTime);

//   try {
//     // Step 1: subscribe all users
//     const contentTopic = 'ContentTopicFinal';
//     const subscriptionTopic = 'SubscriptionTopicFinal';

//     const limit = 1000;
//     for (let index = 0; ; index++) {
//       const offset = index * limit;
//       const tokens = await customerModel.getCandidateCustomerForPushNotification(
//         offset,
//         limit
//       );

//       if (tokens.length == 0) {
//         break;
//       }

//       await SubscribeToTopic(tokens, contentTopic);
//       await SubscribeToTopic(tokens, subscriptionTopic);
//     }

//     // Step 2: blocks all blocked customers
//     const allBlockedCustomers = await CustNotificationBlockModel.getAllBlockedCustomers();

//     // block content customers
//     const contentCustomerIds = allBlockedCustomers
//       .filter((item) => item.notification_type_id == 3)
//       .map((item) => item.customer_id);
//     if (contentCustomerIds.length) {
//       await unsubscribeTopic(contentCustomerIds, contentTopic);
//     }

//     const subscriptionCustomerIds = allBlockedCustomers
//       .filter((item) => item.notification_type_id == 6)
//       .map((item) => item.customer_id);
//     if (subscriptionCustomerIds.length) {
//       await unsubscribeTopic(subscriptionCustomerIds, subscriptionTopic);
//     }

//     return {
//       isSuccess: true,
//       message: 'all numbers were synced with different topics!!'
//     };
//   } catch (error) {
//     console.log((error as Error).message);
//   }
// };

// export const sendPushNotificationUsingTopic = async (
//   scheduleRunTime
// ): Promise<any> => {
//   try {
//     const messageInfo = await model.getMessageInformation(scheduleRunTime);

//     const options = {
//       priority: messageInfo.priority,
//       ttl: 86400 //60 * 60 * 24
//     };

//     // unread count 0 always
//     if (messageInfo.notification_type_id == 3) {
//       await FcmNotificationSendByTopic(
//         'ContentTopicFinal',
//         messageInfo,
//         0,
//         options
//       );
//     } else {
//       await FcmNotificationSendByTopic(
//         'SubscriptionTopicFinal',
//         messageInfo,
//         0,
//         options
//       );
//     }

//     await model.updatePushNotificationForTopic().catch(function(error: any) {
//       console.log('updatePushNotification Error message:', error);
//     });

//     return {
//       isSuccess: true,
//       message: 'complete',
//       messageInfo: messageInfo
//     };
//   } catch (error) {
//     return {
//       isSuccess: false,
//       message: error
//     };
//   }
// };

// export const syncTokens = async (): Promise<any> => {
//   try {
//     console.log('synctokens service');
//     const key = 'tokenStorage';
//     const limit = 1000;
//     let offset = 0;
//     console.log(key);

//     const dbTokens: string[] = [];
//     const existingRedisTokens = await RedisAsync.get(key);

//     while (true) {
//       const tokens: string[] = await customerModel.getCandidateCustomerForPushNotification(
//         offset,
//         limit
//       );

//       if (tokens.length === 0) {
//         break;
//       }

//       dbTokens.push(...tokens);
//       offset += limit;
//     }

//     let redisTokens = existingRedisTokens
//       ? JSON.parse(existingRedisTokens)
//       : [];

//     const tokensToDelete = redisTokens.filter(
//       (token) => !dbTokens.includes(token)
//     );

//     if (tokensToDelete.length > 0) {
//       redisTokens = redisTokens.filter(
//         (token) => !tokensToDelete.includes(token)
//       );
//       if (redisTokens.length > 0) {
//         await RedisAsync.set(key, JSON.stringify(redisTokens));
//       } else {
//         await RedisAsync.del(key);
//       }
//     }

//     const tokensToAdd = dbTokens.filter(
//       (token) => !redisTokens.includes(token)
//     );

//     if (tokensToAdd.length > 0) {
//       if (existingRedisTokens) {
//         redisTokens.push(...tokensToAdd);
//       } else {
//         redisTokens = tokensToAdd;
//       }
//       await RedisAsync.set(key, JSON.stringify(redisTokens));
//     }
//     return {
//       isSuccess: true,
//       message: 'Tokens synced with Redis successfully.'
//     };
//   } catch (error) {
//     console.log('Error syncing tokens with Redis: ', (error as Error).message);
//   }
// };
