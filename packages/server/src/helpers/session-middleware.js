import db from '../models'
import session from 'express-session'
import SequelizeSessionStore from 'connect-session-sequelize'

const MINUTES = 60 * 1000
const HOURS = 60 * MINUTES
const DAYS = 24 * HOURS

export default () => {
  const SequelizeStore = SequelizeSessionStore(session.Store)

  const extendDefaultFields = (defaults, session) => ({
    data: defaults.data,
    expires: defaults.expires,
    modelId: session.modelId,
    modelType: session.modelType,
  })

  const store = new SequelizeStore({
    db: db.sequelize,
    table: 'Session',                                   // Name of the model to be used for sessions
    tableName: 'Sessions',                              // Name of the table to be used to store sessions
    extendDefaultFields,                                // Function to extend default session attributes
    checkExpirationInterval: 15 * MINUTES,              // The interval at which to cleanup expired sessions in milliseconds
  })

  return session({
    // store,   // I disabled this for now because it doesn't work and I will be migrating to Objection in the next PR
    resave: false,                                      // Don't force sessions to be saved back to the store even if they didn't change
    saveUninitialized: false,                           // Don't force uninitialized session to be saved to the store
    secret: process.env.SESSION_SECRET,                 // Secret used to generate session IDs
    name: 'aragonCourtSessionID',                       // Cookie name to be used
    cookie: {
      secure: process.env.SESSION_SECURE === 'true',    // Compliant clients will not send the cookie back to the server if the browser does not have an HTTPS connection
      maxAge: 30 * DAYS,                                // The maximum age in milliseconds of a valid session
      httpOnly: true,                                   // Request cookies only to be used for http communication
    }
  })
}
