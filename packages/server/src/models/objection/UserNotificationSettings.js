const BaseModel = require('./BaseModel')
module.exports = class UserNotificationSettings extends BaseModel {
  static get tableName() {
    return 'KnexUserNotificationSettings'
  }
  static get relationMappings() {
    return {
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: 'Users',
        join: {
          from: 'KnexUserNotificationSettings.userId',
          to: 'KnexUsers.id'
        },
      }
    }
  }
}
