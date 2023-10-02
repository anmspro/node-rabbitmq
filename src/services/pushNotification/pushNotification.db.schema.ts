// /* eslint-disable @typescript-eslint/camelcase */
// import * as Sequelize from 'sequelize';
// import sequelize from '../../core/db/mysql.db';
// import Customer from '../customer/customer.db.schema';
// import NotificationType from '../notificationType/notificationType.db.schema';
// import Product from '../product/product.db.schema';
// import Status from '../Status/status.db.schema';

// const PushNotification = sequelize.define(
//   'push_notifications',
//   {
//     id: {
//       type: Sequelize.BIGINT,
//       allowNull: false,
//       autoIncrement: true,
//       primaryKey: true
//     },
//     notification_type_id: {
//       type: Sequelize.INTEGER
//     },
//     customer_id: {
//       type: Sequelize.BIGINT
//     },
//     phone: {
//       type: Sequelize.STRING
//     },
//     click_action: {
//       type: Sequelize.STRING
//     },
//     device_type: {
//       type: Sequelize.STRING
//     },
//     content_type: {
//       type: Sequelize.STRING
//     },
//     content_id: {
//       type: Sequelize.INTEGER
//     },
//     priority: {
//       type: Sequelize.STRING
//     },
//     push_time: {
//       type: Sequelize.DATE
//     },
//     title: {
//       type: Sequelize.STRING
//     },
//     body: {
//       type: Sequelize.STRING
//     },
//     image_url: {
//       type: Sequelize.STRING
//     },
//     status_id: {
//       type: Sequelize.TINYINT
//     },
//     messageId: {
//       field: 'messageId',
//       type: Sequelize.STRING
//     },
//     multicastId: {
//       field: 'multicastId',
//       type: Sequelize.STRING
//     },
//     remarks: {
//       type: Sequelize.STRING
//     },
//     is_push_sent: {
//       type: Sequelize.TINYINT
//     },
//     created_at: {
//       type: Sequelize.DATE
//     },
//     updated_at: {
//       type: Sequelize.DATE
//     }
//   },
//   {
//     timestamps: false
//   }
// );
// const HIDDEN_ATTRIBUTES = ['created_at', 'updated_at'];

// PushNotification.prototype.toJSON = function(): string {
//   const values = Object.assign({}, this.get());

//   for (const value of HIDDEN_ATTRIBUTES) {
//     delete values[value];
//   }
//   return values;
// };

// PushNotification.belongsTo(Customer);
// PushNotification.belongsTo(Customer, {
//   foreignKey: 'phone',
//   targetKey: 'phone'
// });
// PushNotification.belongsTo(NotificationType);
// PushNotification.belongsTo(Status);
// PushNotification.belongsTo(Product, {foreignKey: 'content_id'});

// export default PushNotification;
