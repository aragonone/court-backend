import BaseModel from './BaseModel'
import { tokenGenerate } from '../../helpers/token-manager'
const MINUTES = 60 * 1000
const HOURS = 60 * MINUTES
const DAYS = 24 * HOURS
const EMAIL_TOKEN_EXPIRES = DAYS

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

  async $sendVerificationEmail() {
    const user = await this.$fetchGraph('email')
    await user.$relatedQuery('emailVerificationToken').del()
    const token = tokenGenerate()
    await user.$relatedQuery('emailVerificationToken').insert({
      email: user.email.email,
      token: token,
      expiresAt: new Date(Date.now()+EMAIL_TOKEN_EXPIRES)
    })
  }
}
