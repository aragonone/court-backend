import Models from '../models'
import RevealsValidator from '../validators/RevealsValidator'

const { Reveal } = Models

export default {
  async show(request, response, next) {
    try {
      const { juror, voteId } = request.body
      const reveal = await Reveal.findOne({ attributes: ['id', 'juror', 'voteId', 'disputeId', 'roundNumber', 'createdAt', 'updatedAt'], where: { juror, voteId } })
      response.status(200).send({ reveal })
    } catch(error) {
      next(error)
    }
  },

  async create(request, response, next) {
    try {
      const params = request.body
      const errors = await RevealsValidator.validateForCreate(params)
      if (errors.length > 0) return response.status(400).send({ errors })

      params.tries = 0
      params.revealed = false
      const reveal = await Reveal.create(params)
      const { id, juror, voteId, disputeId, roundNumber, createdAt, updatedAt } = reveal
      response.status(200).send({ reveal: { id, juror, voteId, disputeId, roundNumber, createdAt, updatedAt }})
    } catch(error) {
      next(error)
    }
  },
}
