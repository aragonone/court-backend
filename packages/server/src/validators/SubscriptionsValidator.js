import { isAddress } from 'web3-utils'
import BaseValidator from './BaseValidator'

class SubscriptionsValidator extends BaseValidator {
  validateForCreate({ email, address }) {
    this._validateEmail(email)
    if (address) this._validateAddress(address)
    return this.resetErrors()
  }

  _validateEmail(email) {
    if (!email) this.addError({ email: 'An email address must be given.' })
  }

  _validateAddress(address) {
    if (!isAddress(address)) this.addError({ address: `Given address '${address}' value is not valid.` })
  }
}

export default new SubscriptionsValidator()
