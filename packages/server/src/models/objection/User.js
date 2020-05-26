import BaseModel from './BaseModel'
import UserEmail from './UserEmail'
import emailClient from '@aragonone/court-backend-shared/helpers/email-client'
import { generateToken } from '../../helpers/token-manager'

const MINUTES = 60 * 1000
const HOURS = 60 * MINUTES
const DAYS = 24 * HOURS
const EMAIL_TOKEN_EXPIRES = DAYS
const EMAIL_TOKEN_OLD = DAYS

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
      notifications: {
        relation: BaseModel.HasManyRelation,
        modelClass: 'UserNotification',
        join: {
          from: 'Users.id',
          to: 'UserNotifications.userId'
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

  static findOne(args) {
    args.address = args.address?.toLowerCase()
    return super.findOne(args)
  }

  async $beforeInsert(queryContext) {
    await super.$beforeInsert(queryContext)
    this.address = this.address?.toLowerCase()
  }

  async $beforeUpdate(opt, queryContext) {
    await super.$beforeUpdate(opt, queryContext)
    this.address = this.address?.toLowerCase()
  }

  static async findWithUnverifiedEmail() {
    const users = await this.query().where({emailVerified: false}).withGraphFetched('[email, emailVerificationToken]')
    return users.filter(user => !!user.email)
  }

  static async findWithOldVerificationToken() {
    const users = await this.findWithUnverifiedEmail()
    return users.filter(user => user.emailVerificationToken && user.emailVerificationToken.expiresAt <= new Date(Date.now()-EMAIL_TOKEN_OLD))
  }

  async findNewAnjRegistrations() {
    const users = await this.findWithUnverifiedEmail()
    return users.filter(user => !user.addressVerified)
  }

  async relateEmail(email) {
    await this.unrelateEmail()
    const emailInstance = await UserEmail.findOne({email})
    if (emailInstance) {
      await this.$relatedQuery('email').relate(emailInstance)
    } else {
      await this.$relatedQuery('email').insert({email})
    }
  }

  async unrelateEmail() {
    const user = await this.$fetchGraph('email')
    let emailInstance = user.email
    await user.$relatedQuery('email').unrelate()
    // clean emails with no users
    if (emailInstance) {
      emailInstance = await emailInstance.$fetchGraph('users')
      if (emailInstance.users.length == 0) {
        await emailInstance.$query().del()
      }
    }
  }
  
  async sendVerificationEmail() {
    const user = await this.$fetchGraph('email')
    const { email: { email }, address } = user
    const tokenExpiresSeconds = EMAIL_TOKEN_EXPIRES/1000
    const token = generateToken(tokenExpiresSeconds)
    await user.relatedUpdateOrInsert('emailVerificationToken', {
      email,
      token,
      expiresAt: new Date(Date.now()+EMAIL_TOKEN_EXPIRES)
    })
    await emailClient.sendMagicLink({
      email, 
      address, 
      token
    })
  }
}
