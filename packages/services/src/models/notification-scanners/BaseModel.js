const { env: { CLIENT_URL } } = process

export default class BaseModel {
  async checkUser(user) {
    user = await user.$fetchGraph('[email, notificationSetting]')
    return (
      user?.email &&
      !user?.notificationSetting?.notificationsDisabled &&
      (user?.emailVerified || this._sendUnverified)
    )
  }
  get _MINUTES() { return 60 * 1000 }
  get _HOURS() { return 60 * this._MINUTES }
  get _DAYS() { return 24 * this._HOURS }
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
  get _sendUnverified() { return false }
  
}
