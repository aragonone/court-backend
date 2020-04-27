import asyncMiddleware from '../helpers/async-middleware'
import authenticateAdmin from './authenticate-admin'
import { admins, users, reveals } from '../controllers'

export default app => {
  app.get('/', (request, response) => response.status(200).send({ message: 'Welcome to Aragon Court server' }))

  /*********** Users routes ***********/

  // check user details
  app.get(    '/users/:address',                      asyncMiddleware(users.details))

  // verify user email using provided token (needs to come before sessions to avoid session authentication)
  app.post(   '/users/:address/email[:]verify',       asyncMiddleware(users.email.verify))

  // manage user sessions
  app.post(   '/users/:address/sessions',             asyncMiddleware(users.sessions.create))
  app.all(    '/users/:address/*',                    asyncMiddleware(users.sessions.authenticate))    // requests below need an authenticated session
  app.delete( '/users/:address/sessions[:]current',   asyncMiddleware(users.sessions.deleteCurrent))
  app.delete( '/users/:address/sessions',             asyncMiddleware(users.sessions.deleteAll))

  // manage user emails
  app.get(    '/users/:address/email',                asyncMiddleware(users.email.get))
  app.put(    '/users/:address/email',                asyncMiddleware(users.email.set))
  app.post(   '/users/:address/email[:]send',         asyncMiddleware(users.email.send))
  app.delete( '/users/:address/email',                asyncMiddleware(users.email.delete))

  // set notifications
  app.put(    '/users/:address/notifications',        asyncMiddleware(users.notifications.set))


  /*********** Old routes ***********/

  app.get(    '/user/:address',                       asyncMiddleware(users.exists))
  app.post(   '/users',                               asyncMiddleware(users.create))

  app.get(    '/reveal',                              asyncMiddleware(reveals.show))
  app.post(   '/reveals',                             asyncMiddleware(reveals.create))


  /*********** Admin routes ***********/

  // admin sessions routes
  app.post(   '/login',                               asyncMiddleware(admins.login))
  app.post(   '/logout',                              authenticateAdmin(admins.logout))

  // manage admins
  app.get(    '/me',                                  authenticateAdmin(admins.me))
  app.get(    '/admins',                              authenticateAdmin(admins.all))
  app.post(   '/admins',                              authenticateAdmin(admins.create))
  app.delete( '/admins/:id',                          authenticateAdmin(admins.delete))

  // manage users and reveals
  app.get(    '/users',                               authenticateAdmin(users.all))
  app.get(    '/reveals',                             authenticateAdmin(reveals.all))
}
