import Models from '../models'

const { ErrorLog } = Models

export default {
  async all(request, response, next) {
    try {
      const limit = request.query.limit || 20
      const offset = (request.query.page || 0) * limit

      const total = await ErrorLog.count()
      const errors = await ErrorLog.findAll({ limit, offset, order: [['createdAt', 'DESC']] })
      response.status(200).send({ errors, total })
    } catch(error) {
      next(error)
    }
  },
}
