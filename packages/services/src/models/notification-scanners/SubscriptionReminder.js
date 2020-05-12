import BaseModel from './BaseModel'
import { User } from '@aragonone/court-backend-server/build/models/objection'

class SubscriptionReminder extends BaseModel {
  async scan() {
    let notifications = []
    const users = await User.query().where({emailVerified: false}).withGraphFetched('[email,emailVerificationToken]')
    for (const user of users) {
      /**
       * Generate subscription reminders in two cases:
       * 1) If user has an existing verification token that expired a day ago
       * 2) If user has no token and address was never verified (previous subscriptions from https://anj.aragon.org/)
       */
      if (!user.email) continue
      if (!user.emailVerificationToken && user.addressVerified) continue
      if (user.emailVerificationToken && user.emailVerificationToken.expiresAt > new Date(Date.now()-this._DAYS)) continue
      notifications.push({ 
        address: user.address,
        details: {
          emailTemplateModel: {}  // still need to add missing reminder email details
        }
      })
    }
    return notifications
  }
  get emailTemplateAlias() { return 'court-subscription-reminder' }
  get scanPeriod() { return this._DAYS }
  get _sendUnverified() { return true }
}

export default new SubscriptionReminder()
