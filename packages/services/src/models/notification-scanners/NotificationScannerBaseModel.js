const { env: { CLIENT_URL } } = process
import { MINUTES, HOURS, DAYS } from '@aragonone/court-backend-shared/helpers/times'

export default class NotificationScannerBaseModel {
  async shouldNotifyUser(user) {
    if (!user) return false
    user = await user.$fetchGraph('[email, notificationSetting]')
    return (
      user.email &&
      !user.notificationSetting?.notificationsDisabled &&
      (user.emailVerified || this._sendUnverified)
    )
  }
  get _MINUTES() { return MINUTES }
  get _HOURS() { return HOURS }
  get _DAYS() { return DAYS }
  get _CLIENT_URL() { return CLIENT_URL }

  // mandatory methods and functions for extended models
  async scan() { 
    return [
      { 
        address: null,
        details: {
          emailTemplateModel: {}
        }
      }
    ]
  }
  get emailTemplateAlias() { return null }
  get scanPeriod() { return 0 * this._DAYS }

  // optional methods and functions
  get _sendUnverified() { return false }  // only SubscriptionReminder should set this to true
  
}
