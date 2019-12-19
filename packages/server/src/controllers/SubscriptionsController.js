import Models from '../models'

const { Subscription } = Models

export default {
  async create(request, response, next) {
    try {
      const params = request.body
      const subscriptions = await Subscription.create(params)
      response.status(200).send(subscriptions)
    } catch(error) {
      next(error)
    }
  }
}
