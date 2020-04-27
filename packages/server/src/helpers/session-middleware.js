import expressSession from 'express-session'
import Sessions from '../models/objection/Sessions'

const MINUTES = 60 * 1000
const HOURS = 60 * MINUTES
const DAYS = 24 * HOURS
const SESSION_MAXAGE = 30 * DAYS
const SESSION_EXPIRE_INTERVAL = HOURS


class ObjectionStore extends expressSession.Store {
  constructor() {
    super()
    this.expireSessions()
  }

  async get(sid, cb=()=>{}) {
    try {
      const sessionData = await Sessions.getData(sid)
      cb(null, sessionData)
    } catch (err) {
      cb(err)
    }
  }

  // newData corresponds to req.session object in express
  async set(sid, newData, cb=()=>{}) {
    try {
      await Sessions.setData(sid, newData)
      cb(null)
    } catch (err) {
      cb(err)
    }
  }

  async destroy(sid, cb=()=>{}) {
    try {
      await Sessions.query().where({sid}).del()
      cb(null)
    } catch (err) {
      cb(err)
    }
  }

  async expireSessions() {
    await Sessions.query().where('updatedAt', '<', new Date(Date.now()-SESSION_MAXAGE)).del()
    setTimeout(this.expireSessions.bind(this), SESSION_EXPIRE_INTERVAL)
  }
}


export default () => {
  return expressSession({
    store: new ObjectionStore(),
    resave: false,                                      // Don't force sessions to be saved back to the store even if they didn't change
    saveUninitialized: false,                           // Don't force uninitialized session to be saved to the store
    secret: process.env.SESSION_SECRET,                 // Secret used to generate session IDs
    name: 'aragonCourtSessionID',                       // Cookie name to be used
    cookie: {
      secure: process.env.SESSION_SECURE === 'true',    // Compliant clients will not send the cookie back to the server if the browser does not have an HTTPS connection
      maxAge: SESSION_MAXAGE,                           // The maximum age in milliseconds of a valid session
      httpOnly: true,                                   // Request cookies only to be used for http communication
    }
  })
}
