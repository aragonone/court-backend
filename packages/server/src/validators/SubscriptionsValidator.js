import BaseValidator from './BaseValidator'
import { isAddress, toBN } from 'web3-utils'

class SubscriptionsValidator extends BaseValidator {
  validateForCreate({ email, address, amount }) {
    this._validateEmail(email)
    if (address) this._validateAddress(address)
    if (amount) this._validateAmount(amount)
    return this.resetErrors()
  }

  _validateEmail(email) {
    if (!email) this.addError({ email: 'An email address must be given.' })
  }

  _validateAddress(address) {
    if (!isAddress(address)) this.addError({ address: `Given address '${address}' value is not valid.` })
  }

  _validateAmount(amount) {
    try {
      toBN(amount)
    } catch (error) {
      return this.addError({ amount: `Given amount value '${amount}' is not valid. It must be a string representing an integer or a hex value. Decimals are not supported.` })
    }
  }
}

export default new SubscriptionsValidator()
