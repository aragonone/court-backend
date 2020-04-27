import Models from '../models'
import HttpError from '../errors/http-error'
import UsersValidator from '../validators/UsersValidator'
import Users from '../models/objection/Users'

const { User, UserAddress } = Models


export default {
  async details(req, res) {
    const { params: { address } } = req
    const user = await Users.query().findOne({address}).withGraphFetched('[email, emailVerificationToken, notificationSettings]')
    res.send({
      emailExists: !!user?.email,
      emailVerified: !!user?.email && !user?.emailVerificationToken,
      addressVerified: user?.addressVerified ?? false,
      notificationsDisabled: user?.notificationSettings?.notificationsDisabled ?? false
    })
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


  async exists(request, response) {
    const { params: { address } } = request
    const exists = await UserAddress.exists(address)
    response.status(200).send({ exists })
  },

  async create(request, response) {
    const params = request.body
    const errors = await UsersValidator.validateForCreate(params)
    if (errors.length > 0) throw HttpError._400({ errors })
    const { email, address } = params
    let user = await User.findOne({ where: { email }, include: [{ model: UserAddress, as: 'addresses' }] })
    if (!user) user = await User.create({ email })
    const userAddress = await UserAddress.create({ address, userId: user.id })
    user.addresses = (!user.addresses) ? [userAddress] : user.addresses.concat([userAddress])
    response.status(200).send(user)
  },

  async all(request, response) {
    const limit = request.query.limit || 20
    const offset = (request.query.page || 0) * limit

    const total = await User.count()
    const users = await User.findAll({ limit, offset, include: [{ model: UserAddress, as: 'addresses' }], order: [['createdAt', 'DESC']] })
    response.status(200).send({ users, total })
  },
}
