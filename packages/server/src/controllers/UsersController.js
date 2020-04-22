import Models from '../models'
import HttpError from '../errors/http-error'
import UsersValidator from '../validators/UsersValidator'

const { User, UserAddress } = Models

// temp dummy models
let Users = { }
let UserEmails = { }
let UserSessions = { }


export default {
  async details(req, res) {
    const { params: { address } } = req
    const body = {
      emailExists: false,
      emailVerified: false,
      addressVerified: false,
      notificationsDisabled: false,
      ... Users[address]
    }
    res.send(body)
  },


  sessions: {
    async create(req, res) {
      const { params: { address } } = req
      if (!Users.hasOwnProperty(address)) {
        Users[address] = {}
      }
      Users[address]['addressVerified'] = true
      if (!UserSessions.hasOwnProperty(address)) {
        UserSessions[address] = {}
      }
      UserSessions[address][req.session.id] = true
      req.session.authenticated = true
      const body = {
        authenticated: true
      }
      res.send(body)
    },

    async authenticate(req,res,next) {
      const { params: { address } } = req
      if (
        !UserSessions.hasOwnProperty(address) ||
        !UserSessions[address].hasOwnProperty(req.session.id)
      ) {
        const errors = [{access: `Unauthorized, please authenticate at /users/${address}/sessions`}]
        throw HttpError._403({ errors })
      }
      next()
    },
    
    async deleteCurrent(req, res) {
      const { params: { address } } = req
      delete UserSessions[address][req.session.id]
      const body = {
        deleted: true
      }
      res.send(body)
    },
    
    async deleteAll(req, res) {
      const { params: { address } } = req
      delete UserSessions[address]
      const body = {
        deleted: true
      }
      res.send(body)
    },
  },


  email: {
    async get(req, res) {
      const { params: { address } } = req
      const body = {
        email: UserEmails[address],
      }
      res.send(body)
    },

    async change(req, res) {
      const { params: { address } } = req
      UserEmails[address] = req.body.email
      if (!Users.hasOwnProperty(address)) {
        Users[address] = {}
      }
      Users[address]['emailExists'] = true
      const body = {
        email: req.body.email,
        sent: true
      }
      res.send(body)
    },
    
    async verify(req, res) {
      const { params: { address } } = req
      Users[address]['emailVerified'] = true
      const body = {
        verified: true
      }
      res.send(body)
    },
    
    async send(req, res) {
      const { params: { address } } = req
      const body = {
        sent: true
      }
      res.send(body)
    },
    
    async delete(req, res) {
      const { params: { address } } = req
      delete UserEmails[address]
      Users[address]['emailExists'] = false
      Users[address]['emailVerified'] = false
      Users[address]['notificationsDisabled'] = false // deleting notifications table entry
      const body = {
        deleted: true
      }
      res.send(body)
    },
  },


  notifications: { 
    async change(req, res) {
      const { params: { address } } = req
      Users[address]['notificationsDisabled'] = req.body.disabled
      const body = {
        disabled: req.body.disabled
      }
      res.send(body)
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
