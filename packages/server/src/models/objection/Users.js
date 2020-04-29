import BaseModel from './BaseModel'
export default class Users extends BaseModel {
  static get tableName() {
    return 'Users'
  }
  static get relationMappings() {
    return {
      sessions: {
        relation: BaseModel.HasManyRelation,
        modelClass: 'Sessions',
        join: {
          from: 'Users.id',
          to: 'Sessions.userId'
        }
      },
      notificationSettings: {
        relation: BaseModel.HasOneRelation,
        modelClass: 'UserNotificationSettings',
        join: {
          from: 'Users.id',
          to: 'UserNotificationSettings.userId'
        }
      },
      emailVerificationToken: {
        relation: BaseModel.HasOneRelation,
        modelClass: 'UserEmailVerificationTokens',
        join: {
          from: 'Users.id',
          to: 'UserEmailVerificationTokens.userId'
        }
      },
      email: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: 'UserEmails',
        join: {
          from: 'Users.userEmailId',
          to: 'UserEmails.id'
        },
      }
    }
  }
}
