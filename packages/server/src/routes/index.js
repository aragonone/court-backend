import authenticate from './authenticate'
import asyncMiddleware from '../helpers/async-middleware'
import { admins, subscriptions, reveals } from '../controllers'

export default app => {
  app.post('/login', asyncMiddleware(admins.login))
  app.get('/reveal', asyncMiddleware(reveals.show))
  app.post('/reveals', asyncMiddleware(reveals.create))
  app.post('/subscriptions', asyncMiddleware(subscriptions.create))

  // Following routes must be authenticated
  app.use(asyncMiddleware((req, res, next) => authenticate(req, res, next)))

  app.get('/me', asyncMiddleware(admins.me))
  app.get('/admins', asyncMiddleware(admins.all))
  app.post('/admins', asyncMiddleware(admins.create))
  app.delete('/admins/:id', asyncMiddleware(admins.delete))

  app.get('/reveals', asyncMiddleware(reveals.all))
  app.get('/subscriptions', asyncMiddleware(subscriptions.all))
}
