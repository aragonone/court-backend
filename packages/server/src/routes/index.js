import authenticate from './authenticate'
import metricsReporter from '../helpers/metrics-reporter'
import asyncMiddleware from '../helpers/async-middleware'
import { admins, users, reveals } from '../controllers'

export default app => {
  const reporter = metricsReporter(app)

  app.use((request, response, next) => {
    reporter.httpRequest(request)
    next()
  })

  app.post('/login', asyncMiddleware(admins.login))

  app.get('/user/:address', asyncMiddleware(users.exists))
  app.post('/users', asyncMiddleware(users.create))

  app.get('/reveal', asyncMiddleware(reveals.show))
  app.post('/reveals', asyncMiddleware(reveals.create))

  // Following routes must be authenticated
  app.use(asyncMiddleware(authenticate))

  app.get('/me', asyncMiddleware(admins.me))
  app.get('/admins', asyncMiddleware(admins.all))
  app.post('/admins', asyncMiddleware(admins.create))
  app.delete('/admins/:id', asyncMiddleware(admins.delete))

  app.get('/users', asyncMiddleware(users.all))
  app.get('/reveals', asyncMiddleware(reveals.all))
}
