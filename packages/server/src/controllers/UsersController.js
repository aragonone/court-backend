import HttpError from '../errors/http-error'
import UsersValidator from '../validators/UsersValidator'
import { User, UserEmail } from '../models/objection'
const MINUTES = 60 * 1000
const HOURS = 60 * MINUTES
const DAYS = 24 * HOURS
const EMAIL_TOKEN_EXPIRES = DAYS


export default {
  async details(req, res) {
    const { params: { address } } = req
    const user = await User.query().findOne({address}).withGraphFetched('[email, emailVerificationToken, notificationSetting]')
    res.send({
      emailExists: !!user?.email,
      emailVerified: !!user?.email && !user?.emailVerificationToken && !!user?.addressVerified,
      addressVerified: !!user?.addressVerified,
      notificationsDisabled: !!user?.notificationSetting?.notificationsDisabled
    })
  },


  async create(req, res) {
    const params = req.body
    const errors = await UsersValidator.validateForCreate(params)
    if (errors.length > 0) throw HttpError._400({ errors })
    const { email, address } = params
    const userEmail = await UserEmail.findOneOrInsert({email})
    await userEmail.$relatedQuery('users').insert({address})
    res.send({
      created: true
    })
  },


  async all(req, res) {
    const page = req.query.page || 0
    const pageSize = req.query.limit || 20

    const usersPage = await User.query().orderBy('createdAt', 'DESC').withGraphFetched('email').page(page, pageSize)
    res.send(usersPage)
  },


  sessions: {
    async create(req, res) {
      const { session, params: { address } } = req
      const user = await User.findOneOrInsert({address})
      await user.$query().update({addressVerified: true})
      session.userId = user.id
      res.send({
        authenticated: true
      })
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
      const user = await User.query().findOne({address})
      await user.$relatedQuery('sessions').del()
      res.send({
        deleted: true
      })
    },
  },


  email: {
    async get(req, res) {
      const { params: { address } } = req
      const user = await User.query().findOne({address})
      const email = await user.$relatedQuery('email')
      res.send({
        email: email?.email ?? null,
      })
    },

    async set(req, res) {
      const { params: { address }, body } = req
      const user = await User.query().findOne({address}).withGraphFetched('email')
      if (!user.email || user.email.email != body.email) {
        await user.$relatedQuery('emailVerificationToken').del()
        await user.$relatedQuery('emailVerificationToken').insert({
          email: body.email,
          token: 'dummy',
          expiresAt: new Date(Date.now()+EMAIL_TOKEN_EXPIRES)
        })
      }
      await user.$relatedUpdateOrInsert('email', {email: body.email})
      res.send({
        email: body.email,
        sent: true
      })
    },

    async verify(req, res) {
      const { params: { address } } = req
      const user = await User.query().findOne({address})
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
      const user = await User.query().findOne({address})
      await user.$relatedQuery('email').del()
      await user.$relatedQuery('emailVerificationToken').del()
      await user.$relatedQuery('notificationSetting').del()
      res.send({
        deleted: true
      })
    },
  },


  notifications: {
    async set(req, res) {
      const { params: { address }, body: { disabled } } = req
      const user = await User.query().findOne({address})
      await user.$relatedUpdateOrInsert('notificationSetting', {notificationsDisabled: disabled})
      res.send({
        disabled
      })
    },
  },
}
