import { Reveal } from '../models/objection'
import Network from '../web3/Network'
import BaseValidator from './BaseValidator'
const { hashVote } = require('@aragonone/celeste-backend-shared/helpers/voting')

class RevealsValidator extends BaseValidator {
  async validateForCreate({ juror, voteId, outcome, salt }) {
    this._validateJuror(juror)
    await this._validateVoteId(juror, voteId)
    await this._validateOutcome(voteId, outcome)
    await this._validateSalt(juror, voteId, outcome, salt)
    return this.resetErrors()
  }

  _validateJuror(juror) {
    if (!juror) return this.addError({ juror: 'A juror address value must be given' })
  }

  async _validateVoteId(juror, voteId) {
    if (!voteId) return this.addError({ voteId: 'A vote ID must be given' })

    const court = await Network.getCourt()
    const exists = await court.existsVote(voteId)
    if (!exists) this.addError({ voteId: `Vote with ID ${voteId} does not exist` })

    if (juror) {
      const reveal = await Reveal.findOne({ juror, voteId })
      if (reveal) this.addError({ voteId: `Vote with ID ${voteId} was already registered to be revealed for juror ${juror}` })
    }
  }

  async _validateOutcome(voteId, outcome) {
    if (!outcome) return this.addError({ outcome: 'An outcome must be given' })

    if (voteId) {
      const court = await Network.getCourt()
      const isValid = await court.isValidOutcome(voteId, outcome)
      if (!isValid) this.addError({ outcome: `Outcome ${outcome} is not valid for the given voteId` })
    }
  }

  async _validateSalt(juror, voteId, outcome, salt) {
    if (!salt) return this.addError({ salt: 'A salt value must be given' })

    if (juror && voteId && outcome) {
      const court = await Network.getCourt()
      const actualCommitment = await court.getCommitment(voteId, juror)
      const expectedCommitment = hashVote(outcome, salt)
      if (expectedCommitment !== actualCommitment) this.addError({ salt: 'Signature does not correspond to the juror address provided' })
    }
  }
}

export default new RevealsValidator()
