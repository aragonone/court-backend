import Models from '../models'
import RevealsValidator from '../validators/RevealsValidator'

const { Reveal } = Models

export default {
  async show(request, response, next) {
    try {
      const { juror, round } = request.body
      const reveal = await Reveal.findOne({ attributes: ['id', 'juror', 'round', 'createdAt', 'updatedAt'], where: { juror, round } })
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

      const reveal = await Reveal.create(params)
      const { id, juror, round, createdAt, updatedAt } = reveal
      response.status(200).send({ reveal: { id, juror, round, createdAt, updatedAt }})
    } catch(error) {
      next(error)
    }
  },
}
