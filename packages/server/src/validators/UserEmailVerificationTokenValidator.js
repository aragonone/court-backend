import BaseValidator from './BaseValidator'
import { Users } from '../models/objection'

class UserEmailVerificationTokenValidator extends BaseValidator {
  async validateForVerify({ address, token }) {
    await this._validateAddressFormat(address)
    if (!this.errors.length) {
      await this._validateTokenFormat({address, token})
    }
    return this.resetErrors()
  }

  async validateForResend({ address }) {
    await this._validateTokenExists(address)
    return this.resetErrors()
  }

  async _validateTokenFormat({ address, token }) {
    const user = await Users.query().findOne({address}).withGraphFetched('emailVerificationToken')
    if (!user) {
      return this.addError({address:  `User ${address} not found`})
    }
    if (!token) {
      return this.addError({token: 'A token must be given'})
    }
    if (token != user?.emailVerificationToken?.token) {
      return this.addError({token: 'Given token is invalid'})
    }
    if (user.emailVerificationToken.expiresAt < new Date()) {
      return this.addError({token: 'Given token has expired'})
    }
  }
  
  async _validateTokenExists(address) {
    const user = await Users.query().findOne({address}).withGraphFetched('emailVerificationToken')
    if (!user?.emailVerificationToken) {
      return this.addError({token: 'There is no existing verification request'})
    }
  }
}

export default new UserEmailVerificationTokenValidator()
