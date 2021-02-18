import NotificationScannerBaseModel from './NotificationScannerBaseModel'
import { User } from '@1hive/celeste-backend-server/build/models/objection'

class SubscriptionReminder extends NotificationScannerBaseModel {
  async scan() {
    let notifications = []
    const users = await User.findWithOldVerificationToken()
    for (let user of users) {
      notifications.push({ 
        address: user.address,
        details: {
          emailTemplateModel: {
            emailPreferencesUrl: this._CLIENT_URL
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
