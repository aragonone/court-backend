import BaseModel from './BaseModel'
export default class UserNotificationSettings extends BaseModel {
  static get tableName() {
    return 'UserNotificationSettings'
  }
  static get relationMappings() {
    return {
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: 'Users',
        join: {
          from: 'UserNotificationSettings.userId',
          to: 'Users.id'
        },
      }
    }
  }
}
