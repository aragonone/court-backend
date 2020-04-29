import asyncMiddleware from '../helpers/async-middleware'
import authenticateUser from './authenticate-user'
import authenticateAdmin from './authenticate-admin'
import { admins, users, reveals } from '../controllers'

export default app => {
  app.get('/', (request, response) => response.status(200).send({ message: 'Welcome to Aragon Court server' }))

  /*********** Users routes ***********/

  // check user details
  app.get(    '/users/:address',                      asyncMiddleware(users.details))

  // add new user address and email
  app.post(   '/users',                               asyncMiddleware(users.create))

  // manage user sessions
  app.post(   '/users/:address/sessions',             asyncMiddleware(users.sessions.create))
  app.delete( '/users/:address/sessions[:]current',   authenticateUser(users.sessions.deleteCurrent))
  app.delete( '/users/:address/sessions',             authenticateUser(users.sessions.deleteAll))

  // manage user emails
  app.get(    '/users/:address/email',                authenticateUser(users.email.get))
  app.put(    '/users/:address/email',                authenticateUser(users.email.set))
  app.post(   '/users/:address/email[:]send',         authenticateUser(users.email.send))
  app.post(   '/users/:address/email[:]verify',       asyncMiddleware(users.email.verify))  // no authentication, validate using a token
  app.delete( '/users/:address/email',                authenticateUser(users.email.delete))

  // set notifications
  app.put(    '/users/:address/notifications',        authenticateUser(users.notifications.set))


  /*********** Reveals routes ***********/

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
