// import * as service from './pushNotification.service';
// import {resSend} from '../../helper/response/response';
// import {constMsg} from '../../helper/utils/const-msg.util';

// export const sendPushNotification = async (_req, res, next): Promise<void> => {
//   try {
//     const currentTime = new Date();
//     // const response = await service.sendPushNotification(currentTime);
//     // const response = await service.sendPushNotificationAllOnce(currentTime);
//     const response = await service.sendPushNotificationWithoutPromise(
//       currentTime,
//       process.env.INSTANCE_ID
//     );
//     const isSuccess = response.isSuccess;
//     const message = response.message;

//     return resSend(
//       'response',
//       response,
//       message,
//       constMsg.SUCCESS_CODE,
//       isSuccess,
//       res
//     );
//   } catch (error) {
//     return next(error);
//   }
// };

// export const updatePushNotificationStatusById = async (
//   req,
//   res,
//   next
// ): Promise<void> => {
//   try {
//     const id = req.params.id;
//     const reqBody = req.body;
//     const devType = req.baseUrl == '/tv' ? 'tv' : 'mobile';
//     const response = await service.updatePushNotificationStatusById(
//       id,
//       reqBody,
//       devType
//     );
//     const isSuccess = response.isSuccess;
//     const message = response.message;

//     return resSend([], [], message, constMsg.SUCCESS_CODE, isSuccess, res);
//   } catch (error) {
//     return next(error);
//   }
// };

// export const sendPush = async (_req, res, next): Promise<void> => {
//   try {
//     console.log('called push');
//     const response = await service.sendPush();
//     const isSuccess = response.isSuccess;
//     const message = response.message;

//     return resSend(
//       'response',
//       response,
//       message,
//       constMsg.SUCCESS_CODE,
//       isSuccess,
//       res
//     );
//   } catch (error) {
//     return next(error);
//   }
// };

// export const syncTopic = async (_req, res, next): Promise<void> => {
//   try {
//     console.log('called synced controller');
//     const response = await service.syncTopic();
//     const isSuccess = response.isSuccess;
//     const message = response.message;

//     return resSend(
//       'response',
//       response,
//       message,
//       constMsg.SUCCESS_CODE,
//       isSuccess,
//       res
//     );
//   } catch (error) {
//     return next(error);
//   }
// };

// export const sendTopicMessage = async (_req, res, next): Promise<void> => {
//   try {
//     const scheduleRunTime = new Date();
//     const response = await service.sendPushNotificationUsingTopic(
//       scheduleRunTime
//     );
//     const isSuccess = response.isSuccess;
//     const message = response.message;

//     return resSend(
//       'response',
//       response,
//       message,
//       constMsg.SUCCESS_CODE,
//       isSuccess,
//       res
//     );
//   } catch (error) {
//     return next(error);
//   }
// };

// export const syncTokens = async (_req, res, next): Promise<void> => {
//   try {
//     console.log('synctokens controller');
//     const response = await service.syncTokens();
//     const isSuccess = response.isSuccess;
//     const message = response.message;

//     return resSend(
//       'response',
//       response,
//       message,
//       constMsg.SUCCESS_CODE,
//       isSuccess,
//       res
//     );
//   } catch (error) {
//     return next(error);
//   }
// };
