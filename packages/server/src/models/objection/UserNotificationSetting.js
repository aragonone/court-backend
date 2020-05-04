import BaseModel from './BaseModel'

export default class UserNotificationSetting extends BaseModel {
  static get tableName() {
    return 'UserNotificationSettings'
  }

  static get relationMappings() {
    return {
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: 'User',
        join: {
          from: 'UserNotificationSettings.userId',
          to: 'Users.id'
        },
      }
    }
  }
}
