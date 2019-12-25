import authenticate from './authenticate'
import asyncMiddleware from '../helpers/async-middleware'
import { users, errors, settlements, subscriptions, reveals } from '../controllers'

export default app => {
  app.post('/login', asyncMiddleware(users.login))
  app.get('/reveal', asyncMiddleware(reveals.show))
  app.post('/reveals', asyncMiddleware(reveals.create))
  app.post('/subscriptions', asyncMiddleware(subscriptions.create))

  // Following routes must be authenticated
  app.use(asyncMiddleware((req, res, next) => authenticate(req, res, next)))

  app.get('/users', asyncMiddleware(users.all))
  app.post('/users', asyncMiddleware(users.create))
  app.delete('/users/:id', asyncMiddleware(users.delete))

  app.get('/errors', asyncMiddleware(errors.all))
  app.get('/reveals', asyncMiddleware(reveals.all))
  app.get('/settlements', asyncMiddleware(settlements.all))
  app.get('/subscriptions', asyncMiddleware(subscriptions.all))
}
