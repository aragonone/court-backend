import validator from 'validator'
import BaseValidator from './BaseValidator'
import { isAddress } from 'web3-utils'

import Users from '../models/objection/Users'

class UsersValidator extends BaseValidator {
  async validateForCreate({ email, address }) {
    this._validateEmail(email)
    await this._validateAddress(address)
    return this.resetErrors()
  }

  _validateEmail(email) {
    if (!email) this.addError({ email: 'An email address must be given' })
    if (!validator.isEmail(email)) this.addError({ email: 'Given email address is not valid' })
  }

  async _validateAddress(address) {
    if (!isAddress(address)) return this.addError({ address: 'Given address is not valid' })
    const count = await Users.query().where({ address }).resultSize()
    if (count > 0) this.addError({ address: 'Given address was already registered' })
  }
}

export default new UsersValidator()
