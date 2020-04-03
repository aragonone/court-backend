import Models from '../models'
import HttpError from '../errors/http-error'
import RevealsValidator from '../validators/RevealsValidator'

const { Reveal } = Models

export default {
  async show(request, response) {
    const { body } = request
    const juror = body.juror || ''
    const voteId = body.voteId || ''

    const reveal = await Reveal.findOne({ attributes: ['id', 'juror', 'voteId', 'disputeId', 'roundNumber', 'createdAt', 'updatedAt'], where: { juror, voteId } })
    response.status(200).send({ reveal })
  },

  async create(request, response) {
    const params = request.body
    const errors = await RevealsValidator.validateForCreate(params)
    if (errors.length > 0) throw HttpError._400({ errors })

    params.revealed = false
    const reveal = await Reveal.create(params)
    const { id, juror, voteId, disputeId, roundNumber, createdAt, updatedAt } = reveal
    response.status(200).send({ reveal: { id, juror, voteId, disputeId, roundNumber, createdAt, updatedAt }})
  },

  async all(request, response) {
    const limit = request.query.limit || 20
    const offset = (request.query.page || 0) * limit

    const total = await Reveal.count()
    const reveals = await Reveal.findAll({ limit, offset, order: [['createdAt', 'DESC']] })
    response.status(200).send({ reveals, total })
  },
}
