import { isAddress } from 'web3-utils'

export default class BaseValidator {
  constructor() {
    this.errors = []
  }

  addError(message) {
    this.errors.push(message)
  }

  resetErrors() {
    const errors = this.errors
    this.errors = []
    return errors
  }

  // functions reused in multiple validators
  async _validateAddressFormat(address) {
    if (!address) {
      return this.addError({address: 'An address must be given'})
    }
    if (!isAddress(address)) {
      return this.addError({address: 'Given address is not valid'})
    }
  }
}
