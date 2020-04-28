import HttpError from '../errors/http-error'
import UsersValidator from '../validators/UsersValidator'
import Users from '../models/objection/Users'
import UserEmails from '../models/objection/UserEmails'


export default {
  async details(req, res) {
    const { params: { address } } = req
    const user = await Users.query().findOne({address}).withGraphFetched('[email, emailVerificationToken, notificationSettings]')
    res.send({
      emailExists: !!user?.email,
      emailVerified: !!user?.email && !user?.emailVerificationToken && !!user?.addressVerified,
      addressVerified: !!user?.addressVerified,
      notificationsDisabled: !!user?.notificationSettings?.notificationsDisabled
    })
  },


  async create(req, res) {
    const params = req.body
    const errors = await UsersValidator.validateForCreate(params)
    if (errors.length > 0) throw HttpError._400({ errors })
    const { email, address } = params
    let userEmail = await UserEmails.query().findOne({email})
    if (!userEmail) userEmail= await UserEmails.query().insert({email})
    await userEmail.$relatedQuery('users').insert({address})
    res.send({
      created: true
    })
  },


  async all(req, res) {
    const page = req.query.page || 0
    const pageSize = req.query.limit || 20
    const usersPage = await Users.query().orderBy('createdAt', 'DESC').withGraphFetched('email').page(page, pageSize)
    // usersPage contains users.results array for user objects and users.total for total count
    res.send(usersPage)
  },


  sessions: {
    async create(req, res) {
      const { session, params: { address } } = req
      let user = await Users.query().findOne({address})
      if (!user) {
        user = await Users.query().insert({address})
      }
      await user.$query().update({addressVerified: true})
      session.userId = user.id
      res.send({
        authenticated: true
      })
    },

    async authenticate(req,res,next) {
      const { session, params: { address } } = req
      if (!session.userId) {
        const errors = [{access: `Unauthorized, please authenticate at /users/${address}/sessions`}]
        throw HttpError._403({ errors })
      }
      next()
    },

    async deleteCurrent(req, res) {
      req.session.destroy(() => {
        res.send({
          deleted: true
        })
      })
    },

    async deleteAll(req, res) {
      const { params: { address } } = req
      const user = await Users.query().findOne({address})
      await user.$relatedQuery('sessions').del()
      res.send({
        deleted: true
      })
    },
  },


  email: {
    async get(req, res) {
      const { params: { address } } = req
      const user = await Users.query().findOne({address})
      const email = await user.$relatedQuery('email')
      res.send({
        email: email?.email ?? null,
      })
    },

    async set(req, res) {
      const { params: { address }, body } = req
      const user = await Users.query().findOne({address})
      const email = await user.$relatedQuery('email')
      if (email) {
        await user.$relatedQuery('email').update({email: body.email})
      } else {
        await user.$relatedQuery('email').insert({email: body.email})
      }
      if (!email || email.email != body.email) {
        await user.$relatedQuery('emailVerificationToken').del()
        await user.$relatedQuery('emailVerificationToken').insert({email: body.email, token: 'dummy'})
      }
      res.send({
        email: body.email,
        sent: true
      })
    },

    async verify(req, res) {
      const { params: { address } } = req
      const user = await Users.query().findOne({address})
      await user.$relatedQuery('emailVerificationToken').del()
      res.send({
        verified: true
      })
    },

    async send(req, res) {
      res.send({
        sent: true
      })
    },

    async delete(req, res) {
      const { params: { address } } = req
      const user = await Users.query().findOne({address})
      await user.$relatedQuery('email').del()
      await user.$relatedQuery('emailVerificationToken').del()
      await user.$relatedQuery('notificationSettings').del()
      res.send({
        deleted: true
      })
    },
  },


  notifications: {
    async set(req, res) {
      const { params: { address }, body: { disabled } } = req
      const user = await Users.query().findOne({address})
      const notificationSettings = await user.$relatedQuery('notificationSettings')
      if (notificationSettings) {
        await user.$relatedQuery('notificationSettings').update({notificationsDisabled: disabled})
      } else {
        await user.$relatedQuery('notificationSettings').insert({notificationsDisabled: disabled})
      }
      res.send({
        disabled
      })
    },
  },
}
