import bcrypt from 'bcryptjs'
import Models from '../models'
import BaseValidator from './BaseValidator'

const { User } = Models

class UserValidator extends BaseValidator {
  async validateForLogin({ email, password }) {
    console.log(email, password)
    await this._validateEmail(email)
    await this._validatePassword(password)
    await this._validateEmailAndPassword(email, password)
    return this.resetErrors()
  }

  async validateForCreate({ email, password }) {
    await this._validateUniqueEmail(email)
    await this._validatePassword(password)
    return this.resetErrors()
  }

  async validateForDelete({ id }) {
    await this._validateUserId(id)
    return this.resetErrors()
  }

  async _validateEmail(email) {
    if (!email) return this.addError({ email: 'An email must be given' })
  }

  async _validatePassword(password) {
    if (!password) this.addError({ password: 'A password must be given '})
  }

  async _validateUniqueEmail(email) {
    if (!email) return this.addError({ email: 'An email must be given' })
    const count = await User.count({ where: { email }})
    if (count > 0) this.addError({ email: 'Given email is already used' })
  }

  async _validateEmailAndPassword(email, password) {
    if (email && password) {
      const user = await User.findOne({ where: { email }})
      const matches = user ? bcrypt.compareSync(password, user.password) : false
      if (!matches) this.addError({ password: 'Authentication failed, email or password is not valid'})
    }
  }

  async _validateUserId(id) {
    if (!id) return this.addError({ id: 'A user ID must be given' })
    const count = await User.count({ where: { id }})
    if (count === 0) this.addError({ id: 'Given id does not exist' })
  }
}

export default new UserValidator()
