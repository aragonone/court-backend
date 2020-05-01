import BaseValidator from './BaseValidator'
import { Users } from '../models/objection'

class UserEmailVerificationTokenValidator extends BaseValidator {
  async validateForVerify({ address, token }) {
    await this._validateToken({address, token})
    return this.resetErrors()
  }

  async _validateToken({ address, token }) {
    if (!token) {
      return this.addError({token: 'A token must be given'})
    }
    const user = await Users.query().findOne({address}).withGraphFetched('emailVerificationToken')
    if (token != user?.emailVerificationToken?.token) {
      return this.addError({token: 'Given token is invalid'})
    }
    if (user.emailVerificationToken.expiresAt < new Date()) {
      return this.addError({token: 'Given token has expired'})
    }
  }
}

export default new UserEmailVerificationTokenValidator()
