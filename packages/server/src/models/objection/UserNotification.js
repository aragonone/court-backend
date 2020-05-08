import BaseModel from './BaseModel'

export default class UserNotification extends BaseModel {
  static get tableName() {
    return 'UserNotifications'
  }

  static get relationMappings() {
    return {
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: 'User',
        join: {
          from: 'UserNotifications.userId',
          to: 'Users.id'
        },
      },
      type: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: 'UserNotificationType',
        join: {
          from: 'UserNotifications.userNotificationTypeId',
          to: 'UserNotificationTypes.id'
        },
      },
    }
  }
}
