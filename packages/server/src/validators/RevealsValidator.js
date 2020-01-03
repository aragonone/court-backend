import Models from '../models'
import Network from '../web3/Network'
import BaseValidator from './BaseValidator'
const { hashVote } = require('@aragon/court/test/helpers/utils/crvoting')

const { Reveal } = Models

class RevealsValidator extends BaseValidator {
  async validateForCreate({ juror, round, outcome, salt }) {
    this._validateJuror(juror)
    await this._validateRound(juror, round)
    await this._validateOutcome(round, outcome)
    await this._validateSalt(juror, round, outcome, salt)
    return this.resetErrors()
  }

  _validateJuror(juror) {
    if (!juror) return this.addError({ juror: 'A juror address value must be given' })
  }

  async _validateRound(juror, round) {
    if (!round) return this.addError({ round: 'A round ID must be given' })

    const court = await Network.getCourt()
    const exists = await court.existsVote(round)
    if (!exists) this.addError({ round: `Round with ID ${round} does not exist` })

    if (juror) {
      const reveal = await Reveal.findOne({ attributes: ['id'], where: { juror, round } })
      if (reveal !== null) this.addError({ round: `Round with ID ${round} was already registered to be revealed for juror ${juror}` })
    }
  }

  async _validateOutcome(round, outcome) {
    if (!outcome) return this.addError({ outcome: 'An outcome must be given' })

    if (round) {
      const court = await Network.getCourt()
      const isValid = await court.isValidOutcome(round, outcome)
      if (!isValid) this.addError({ outcome: `Outcome ${outcome} is not valid for the given round` })
    }
  }

  async _validateSalt(juror, round, outcome, salt) {
    if (!salt) return this.addError({ salt: 'A salt value must be given' })

    if (juror && round && outcome) {
      const court = await Network.getCourt()
      const actualCommitment = await court.getCommitment(round, juror)
      const expectedCommitment = hashVote(outcome, salt)
      if (expectedCommitment !== actualCommitment) this.addError({ salt: 'Signature does not correspond to the juror address provided' })
    }
  }
}

export default new RevealsValidator()
