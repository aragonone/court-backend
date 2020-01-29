import Models from '../models'

const { Settlement } = Models

export default {
  async all(request, response, next) {
    try {
      const limit = request.query.limit || 20
      const offset = (request.query.page || 0) * limit

      const total = await Settlement.count()
      const settlements = await Settlement.findAll({ limit, offset, order: [['createdAt', 'DESC']] })
      response.status(200).send({ settlements, total })
    } catch(error) {
      next(error)
    }
  },
}
