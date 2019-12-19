import asyncMiddleware from '../helpers/async-middleware'
import { subscriptions } from '../controllers'

export default app => {
  app.post('/subscriptions', asyncMiddleware(subscriptions.create))
}
