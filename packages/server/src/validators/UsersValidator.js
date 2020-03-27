import Models from '../models'
import BaseValidator from './BaseValidator'
import { isAddress } from 'web3-utils'

const { UserAddress } = Models

class UsersValidator extends BaseValidator {
  async validateForCreate({ email, address }) {
    this._validateEmail(email)
    await this._validateAddress(address)
    return this.resetErrors()
  }

  _validateEmail(email) {
    if (!email) this.addError({ email: 'An email address must be given' })
  }

  async _validateAddress(address) {
    const parsedAddress = address.toLowerCase()
    if (!isAddress(parsedAddress)) return this.addError({ address: 'Given address is not valid' })

    const count = await UserAddress.count({ where: { address: parsedAddress }})
    if (count > 0) this.addError({ address: 'Given address was already registered' })
  }
}

export default new UsersValidator()
