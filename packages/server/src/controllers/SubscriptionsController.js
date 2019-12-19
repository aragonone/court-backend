import Models from '../models'
import SubscriptionsValidator from '../validators/SubscriptionsValidator'

const { Subscription } = Models

export default {
  async create(request, response, next) {
    try {
      const params = request.body
      const errors = await SubscriptionsValidator.validateForCreate(params)
      if (errors.length > 0) return response.status(400).send({ errors })

      const subscriptions = await Subscription.create(params)
      response.status(200).send(subscriptions)
    } catch(error) {
      next(error)
    }
  }
}
