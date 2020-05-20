import BaseModel from './BaseModel'

export default class UserNotificationType extends BaseModel {
  static get tableName() {
    return 'UserNotificationTypes'
  }

  static get relationMappings() {
    return {
      notifications: {
        relation: BaseModel.HasManyRelation,
        modelClass: 'UserNotification',
        join: {
          from: 'UserNotificationTypes.id',
          to: 'UserNotifications.userNotificationTypeId'
        }
      },
    }
  }
}
