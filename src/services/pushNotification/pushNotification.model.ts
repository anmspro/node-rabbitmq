// /* eslint-disable @typescript-eslint/camelcase */
// import {Op} from 'sequelize';
// // import sequelize from '../../core/db/mysql.db';
// import {APIError} from '../../core/error/apiError';
// import ContentType from '../contentType/contentType.db.schema';
// import Customer from '../customer/customer.db.schema';
// import CustNotificationBlock from '../customerNotificationBlock/customerNotificationBlock.db.schema';
// import MaturityLevel from '../maturityLevel/maturityLevel.db.schema';
// import Product from '../product/product.db.schema';
// import PushNotification from './pushNotification.db.schema';

// // Customer.hasMany(CustNotificationBlock, {as: 'notificationPreference'});

// export const sendPushNotification = async (
//   scheduleRunTime,
//   offset,
//   limit
// ): Promise<any> => {
//   try {
//     return await PushNotification.findAll({
//       where: {
//         status_id: 3,
//         // customer_id: 1069,
//         push_time: {[Op.lte]: scheduleRunTime}
//       },
//       include: [
//         {
//           model: Customer,
//           attributes: ['id', 'phone', 'firebase_token', 'os_type'],
//           include: {
//             model: CustNotificationBlock,
//             as: 'notificationPreference',
//             required: false,
//             attributes: ['id', 'customer_id', 'notification_type_id'],
//             where: {
//               notification_type_id: {
//                 [Op.col]: 'push_notifications.notification_type_id'
//               }
//               // notification_type_id: sequelize.literal(
//               //   'push_notifications.notification_type_id'
//               // )
//             }
//           }
//         },
//         {
//           model: Product,
//           required: false,
//           attributes: ['id', 'content_type_id', 'maturity_level_id'],
//           include: [
//             {
//               model: ContentType,
//               attributes: ['id', 'name']
//             },
//             {
//               model: MaturityLevel,
//               attributes: ['id', 'title']
//             }
//           ]
//         }
//       ],
//       attributes: [
//         'id',
//         'notification_type_id',
//         'click_action',
//         'phone',
//         'device_type',
//         'content_type',
//         'content_id',
//         'priority',
//         'title',
//         'body',
//         'image_url'
//       ],
//       offset: offset,
//       limit: limit,
//       order: [['id', 'ASC']]
//     });
//   } catch (error) {
//     throw new APIError({
//       message: (error as Error).message,
//       status: 500,
//       isSuccess: false
//     });
//   }
// };

// export const sendPushNotificationCount = async (
//   scheduleRunTime
// ): Promise<any> => {
//   try {
//     return await PushNotification.count({
//       where: {
//         status_id: 3,
//         // customer_id: 1069,
//         push_time: {[Op.lte]: scheduleRunTime}
//       }
//     });
//   } catch (error) {
//     throw new APIError({
//       message: (error as Error).message,
//       status: 500,
//       isSuccess: false
//     });
//   }
// };

// export const updatePushNotification = async (id, dataObj): Promise<any> => {
//   try {
//     return await PushNotification.update(dataObj, {
//       where: {id: id}
//     });
//   } catch (error) {
//     throw new APIError({
//       message: (error as Error).message,
//       status: 500,
//       isSuccess: false
//     });
//   }
// };

// export const updatePushNotificationForTopic = async (): Promise<any> => {
//   try {
//     return await PushNotification.update(
//       {
//         is_push_sent: 1
//       },
//       {
//         where: {status_id: 3, is_push_sent: 0}
//       }
//     );
//   } catch (error) {
//     throw new APIError({
//       message: (error as Error).message,
//       status: 500,
//       isSuccess: false
//     });
//   }
// };

// export const getMessageInformation = async (scheduleRunTime): Promise<any> => {
//   try {
//     return await PushNotification.findOne({
//       where: {
//         status_id: 3,
//         is_push_sent: 0,
//         push_time: {[Op.lte]: scheduleRunTime}
//       },
//       include: [
//         {
//           model: Customer,
//           attributes: ['id', 'phone', 'firebase_token', 'os_type'],
//           include: {
//             model: CustNotificationBlock,
//             as: 'notificationPreference',
//             required: false,
//             attributes: ['id', 'customer_id', 'notification_type_id'],
//             where: {
//               notification_type_id: {
//                 [Op.col]: 'push_notifications.notification_type_id'
//               }
//               // notification_type_id: sequelize.literal(
//               //   'push_notifications.notification_type_id'
//               // )
//             }
//           }
//         },
//         {
//           model: Product,
//           required: false,
//           attributes: ['id', 'content_type_id', 'maturity_level_id'],
//           include: [
//             {
//               model: ContentType,
//               attributes: ['id', 'name']
//             },
//             {
//               model: MaturityLevel,
//               attributes: ['id', 'title']
//             }
//           ]
//         }
//       ],
//       attributes: [
//         'id',
//         'notification_type_id',
//         'click_action',
//         'phone',
//         'device_type',
//         'content_type',
//         'content_id',
//         'priority',
//         'title',
//         'body',
//         'image_url'
//       ],
//       limit: 1,
//       order: [['id', 'DESC']]
//     });
//   } catch (error) {
//     throw new APIError({
//       message: (error as Error).message,
//       status: 500,
//       isSuccess: false
//     });
//   }
// };
