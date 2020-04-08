import authenticate from './authenticate'
import asyncMiddleware from '../helpers/async-middleware'
import { admins, users, reveals } from '../controllers'

export default app => {
  app.get('/', (request, response) => response.status(200).send({ message: 'Welcome to Aragon Court server' }))

  // check user details
  app.get(    '/users/:address',                      asyncMiddleware(users.details))

  // manage user sessions
  app.post(   '/users/:address/sessions',             asyncMiddleware(users.sessions.create))
  app.all(    '/users/:address/*',                    asyncMiddleware(users.sessions.authenticate))    // requests below need an authenticated session
  app.delete( '/users/:address/sessions[:]current',   asyncMiddleware(users.sessions.deleteCurrent))
  app.delete( '/users/:address/sessions',             asyncMiddleware(users.sessions.deleteAll))

  // manage user emails
  app.get(    '/users/:address/email',                asyncMiddleware(users.email.get))
  app.put(    '/users/:address/email',                asyncMiddleware(users.email.change))
  app.post(   '/users/:address/email[:]verify',       asyncMiddleware(users.email.verify))
  app.post(   '/users/:address/email[:]send',         asyncMiddleware(users.email.send))
  app.delete( '/users/:address/email',                asyncMiddleware(users.email.delete))

  // set notifications
  app.put(    '/users/:address/notifications',        asyncMiddleware(users.notifications.change))


  // other endpoints
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
