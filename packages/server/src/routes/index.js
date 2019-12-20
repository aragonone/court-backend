import asyncMiddleware from '../helpers/async-middleware'
import { subscriptions, reveals } from '../controllers'

export default app => {
  app.get('/reveals', asyncMiddleware(reveals.show))
  app.post('/reveals', asyncMiddleware(reveals.create))
  app.post('/subscriptions', asyncMiddleware(subscriptions.create))
}
