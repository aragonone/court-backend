import { Reveal } from '../models/objection'
import HttpError from '../errors/http-error'
import RevealsValidator from '../validators/RevealsValidator'
import { decodeVoteId } from '@aragonone/court-backend-shared/helpers/voting'

export default {
  async show(request, response) {
    const { params: { juror, voteId } } = request
    const reveal = await Reveal.query().select('id', 'juror', 'voteId', 'disputeId', 'roundNumber', 'createdAt', 'updatedAt').findOne({ juror, voteId })
    response.status(200).send({ reveal })
  },

  async create(request, response) {
    const params = request.body
    const errors = await RevealsValidator.validateForCreate(params)
    if (errors.length > 0) throw HttpError.BAD_REQUEST({ errors })

    const decodedVoteId = decodeVoteId(params.voteId)
    params.revealed = false
    params.disputeId = decodedVoteId.disputeId.toString()
    params.roundNumber = decodedVoteId.roundId.toString()
    const reveal = await Reveal.create(params)

    const { id, juror, voteId, disputeId, roundNumber, revealed, failedAttempts, createdAt, updatedAt } = reveal
    response.status(200).send({ reveal: { id, juror, voteId, disputeId, roundNumber, revealed, failedAttempts, createdAt, updatedAt }})
  },

  async all(request, response) {
    const page = request.query.page || 0
    const pageSize = request.query.limit || 20

    const revealsPage = await Reveal.query().orderBy('createdAt', 'DESC').page(page, pageSize)
    response.status(200).send(revealsPage)
  },
}
