const BaseModel = require('./BaseModel')
module.exports = class Users extends BaseModel {
  static get tableName() {
    return 'KnexUsers'
  }
  static get relationMappings() {
    return {
      sessions: {
        relation: BaseModel.HasManyRelation,
        modelClass: 'Sessions',
        join: {
          from: 'KnexUsers.id',
          to: 'KnexSessions.userId'
        }
      },
      notificationSettings: {
        relation: BaseModel.HasOneRelation,
        modelClass: 'UserNotificationSettings',
        join: {
          from: 'KnexUsers.id',
          to: 'KnexUserNotificationSettings.userId'
        }
      },
      emailVerificationToken: {
        relation: BaseModel.HasOneRelation,
        modelClass: 'UserEmailVerificationTokens',
        join: {
          from: 'KnexUsers.id',
          to: 'KnexUserEmailVerificationTokens.userId'
        }
      },
      email: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: 'UserEmails',
        join: {
          from: 'KnexUsers.userEmailId',
          to: 'KnexUserEmails.id'
        },
      }
    }
  }
}
