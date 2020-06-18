import BaseModel from './BaseModel'
const MINUTES = 60 * 1000
const HOURS = 60 * MINUTES

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

  static findUnsent() {
    return this.query()
      .whereNull('sentAt')
      .andWhere('createdAt', '>', new Date(Date.now()-HOURS))
  }
}
