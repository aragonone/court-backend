import { utils } from 'ethers'
import BaseValidator from './BaseValidator'

import { MINUTES } from '@aragonone/court-backend-shared/build/helpers/times'
const SESSION_SIGNATURE_EXPIRES = MINUTES * 10

class UserSessionsValidator  extends BaseValidator {
  async validateForCreate({address, signature, timestamp}) {
    await this._validateAddressFormat(address)
    await this._validateTimestampFormat(timestamp)
    await this._validateSignatureFormat(signature)
    if (!this.errors.length) {
      await this._validateSignatureAddress({address, signature, timestamp})
    }
    return this.resetErrors()
  }

  async _validateTimestampFormat(timestamp) {
    if (!timestamp) {
      return this.addError({timestamp: 'A timestamp must be given'})
    }
    if (parseInt(timestamp) > Date.now()) {
      return this.addError({timestamp: 'Given timestamp is invalid'})
    }
    if (parseInt(timestamp) < Date.now()-SESSION_SIGNATURE_EXPIRES) {
      return this.addError({timestamp: 'Given timestamp is obsolete'})
    }
  }

  async _validateSignatureFormat(signature) {
    if (!signature) {
      return this.addError({signature: 'A signature must be given'})
    }
    try {
      utils.splitSignature(signature)
    } catch {
      this.addError({ signature: 'Given signature is invalid' })
    }
  }

  async _validateSignatureAddress({address, signature, timestamp}) {
    const signedAddress = utils.verifyMessage(timestamp.toString(), signature)
    if (address.toLowerCase() !== signedAddress.toLowerCase()) {
      this.addError({ signature: 'Signature address and user address do not match' })
    }
  }
}

export default new UserSessionsValidator()
