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

  /**
   * Each scan must return an object with address and details with optional emailTemplateModel:
   * return [
   *   { 
   *     address: null,
   *     details: {
   *       emailTemplateModel: {}
   *     }
   *   }
   * ]
   */
  async scan() { throw 'subclass responsibility' }

  /**
   * Must return one of the email aliases available in postmark
   */
  get emailTemplateAlias() { throw 'subclass responsibility' }

  /**
   * Use one of the provided time constants:
   * this._MINUTES, this._HOURS, this._DAYS
   */
  get scanPeriod() { throw 'subclass responsibility' }

  // optional methods and functions
  get _sendUnverified() { return false }  // only SubscriptionReminder should set this to true
  
}
