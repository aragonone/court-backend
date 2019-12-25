import authenticate from './authenticate'
import asyncMiddleware from '../helpers/async-middleware'
import { users, subscriptions, reveals } from '../controllers'

export default app => {
  app.post('/login', asyncMiddleware(users.login))
  app.get('/reveals', asyncMiddleware(reveals.show))
  app.post('/reveals', asyncMiddleware(reveals.create))
  app.post('/subscriptions', asyncMiddleware(subscriptions.create))

  // Following routes must be authenticated
  app.use(asyncMiddleware((req, res, next) => authenticate(req, res, next)))

  app.post('/logout', asyncMiddleware(users.logout))
  app.post('/users', asyncMiddleware(users.create))
  app.delete('/users/:id', asyncMiddleware(users.delete))
}
