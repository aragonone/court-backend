import validator from 'validator'

import BaseValidator from './BaseValidator'
import { User } from '../models/objection'

class UsersValidator extends BaseValidator {
  async validateForCreate({ address, email }) {
    await this._validateAddressFormat(address)
    if (!this.errors.length) {
      await this._validateAddressNew(address)
    }
    await this._validateEmailFormat(email)
    return this.resetErrors()
  }

  async validateBaseAddress({ address }) {
    await this._validateAddressFormat(address)
    return this.resetErrors()
  }

  async validateForEmailSet({ address, email }) {
    await this._validateEmailFormat(email)
    if (!this.errors.length) {
      await this._validateEmailChange({address, email})
    }
    return this.resetErrors()
  }

  async _validateAddressNew(address) {
    const count = await User.getCount({address})
    if (count > 0) {
     this.addError({address: 'Given address is already registered'})
    }
  }

  async _validateEmailFormat(email) {
    if (!email) {
      this.addError({email: 'An email address must be given'})
    } else if (!validator.isEmail(email)) {
      this.addError({email: 'Given email address is not valid'})
    }
  }

  async _validateEmailChange({ address, email }) {
    const user = await User.query().findOne({address}).withGraphFetched('email')
    if (user?.email?.email == email) {
     this.addError({email: 'Given email is already set'})
    }
  }
}

export default new UsersValidator()
