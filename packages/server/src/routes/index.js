import asyncMiddleware from '../helpers/async-middleware'
import authenticateUser from './authenticate-user'
import authenticateAdmin from './authenticate-admin'
import {
  users,
  userSessions,
  userEmail,
  userNotifications,
  admins,
  reveals,
  emails,
} from '../controllers'

export default app => {
  app.get('/', (request, response) => response.status(200).send({ message: 'Welcome to Celeste server' }))

  /*********** Users routes ***********/

  // check user details
  app.get(    '/users/:address',                      asyncMiddleware(users.details))

  // add new user address and email
  app.post(   '/users',                               asyncMiddleware(users.create))

  // manage user sessions
  app.post(   '/users/:address/sessions',             asyncMiddleware(userSessions.create))
  app.delete( '/users/:address/sessions[:]current',   authenticateUser(userSessions.deleteCurrent))
  app.delete( '/users/:address/sessions',             authenticateUser(userSessions.deleteAll))

  // manage user emails
  app.get(    '/users/:address/email',                authenticateUser(userEmail.get))
  app.put(    '/users/:address/email',                authenticateUser(userEmail.set))
  app.post(   '/users/:address/email[:]resend',       authenticateUser(userEmail.resend))
  app.post(   '/users/:address/email[:]verify',       asyncMiddleware(userEmail.verify))  // no authentication, validate using a token
  app.delete( '/users/:address/email',                authenticateUser(userEmail.delete))

  // set notifications
  app.put(    '/users/:address/notifications',        authenticateUser(userNotifications.set))


  /*********** Reveals routes ***********/

  app.get(    '/reveals/:juror/:voteId',              asyncMiddleware(reveals.show))
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

  // send manual email
  app.post(   '/emails',                              authenticateAdmin(emails.send))
}
