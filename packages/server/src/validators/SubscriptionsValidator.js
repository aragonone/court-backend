import BaseValidator from './BaseValidator'

class SubscriptionsValidator extends BaseValidator {
  async validateForCreate({ email }) {
    this._validateEmail(email)
    return this.resetErrors()
  }

  _validateEmail(email) {
    if (!email) this.addError({ email: 'An email address must be given' })
  }
}

export default new SubscriptionsValidator()
