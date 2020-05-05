import BaseModel from './BaseModel'

export default class User extends BaseModel {
  static get tableName() {
    return 'Users'
  }

  static get relationMappings() {
    return {
      sessions: {
        relation: BaseModel.HasManyRelation,
        modelClass: 'Session',
        join: {
          from: 'Users.id',
          to: 'Sessions.userId'
        }
      },
      notificationSetting: {
        relation: BaseModel.HasOneRelation,
        modelClass: 'UserNotificationSetting',
        join: {
          from: 'Users.id',
          to: 'UserNotificationSettings.userId'
        }
      },
      emailVerificationToken: {
        relation: BaseModel.HasOneRelation,
        modelClass: 'UserEmailVerificationToken',
        join: {
          from: 'Users.id',
          to: 'UserEmailVerificationTokens.userId'
        }
      },
      email: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: 'UserEmail',
        join: {
          from: 'Users.userEmailId',
          to: 'UserEmails.id'
        },
      }
    }
  }
}
