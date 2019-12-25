import Models from '../models'
import RevealsValidator from '../validators/RevealsValidator'

const { Reveal, ErrorLog } = Models

export default {
  async show(request, response, next) {
    try {
      const { body } = request
      const juror = body.juror || ''
      const voteId = body.voteId || ''

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

  async all(request, response, next) {
    try {
      const limit = request.query.limit || 20
      const offset = (request.query.page || 0) * limit

      const total = await Reveal.count()
      const reveals = await Reveal.findAll({ limit, offset, include: [{ model: ErrorLog, as: 'error' }], order: [['createdAt', 'DESC']] })
      response.status(200).send({ reveals, total })
    } catch(error) {
      next(error)
    }
  },
}
