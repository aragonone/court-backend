import NotificationScannerBaseModel from './NotificationScannerBaseModel'
import { User } from '@aragonone/court-backend-server/build/models/objection'

class SubscriptionReminder extends NotificationScannerBaseModel {
  async scan() {
    let notifications = []
    const users = await User.findWithUnverifiedEmail()
    for (const user of users) {
      if (!await user.registeredOnAnj() && !await user.hasOldVerificationToken()) continue
      notifications.push({ 
        address: user.address,
        details: {
          emailTemplateModel: {
            emailPreferencesUrl: `${this._CLIENT_URL}?preferences=notifications`
          },
          token: user.emailVerificationToken?.id ?? null
        }
      })
    }
    return notifications
  }
  get emailTemplateAlias() { return 'email-verification-reminder' }
  get scanPeriod() { return this._DAYS }
  get _sendUnverified() { return true }
}

export default new SubscriptionReminder()
