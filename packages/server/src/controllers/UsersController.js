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
    let body = {
      emailExists: false,
      emailVerified: false,
      addressVerified: false,
      notificationsEnabled: false
    }
    Object.assign(body, Users[address])  // Object.assign acts as a merge to avoid empty keys
    res.send(body)
  },


  sessions: {
    async create(req, res) {
      const { params: { address } } = req
      if (!(address in Users)) {
        Users[address] = {}
      }
      Users[address]['addressVerified'] = true
      if (!(address in UserSessions)) {
        UserSessions[address] = {}
      }
      UserSessions[address][req.session.id] = true
      let body = {
        authenticated: true
      }
      res.send(body)
    },

    async authenticate(req,res,next) {
      const { params: { address } } = req
      if (
        !(address in UserSessions) ||
        !(req.session.id in UserSessions[address])
      ) {
        // exception for new emails from anj
        if (req.path.endsWith("/email") && !(address in Users)) {
          return next()
        }
        const errors = [{access: `Unauthorized, please authenticate at /users/${address}/sessions`}]
        throw HttpError._403({ errors })
      }
      next()
    },
    
    async deleteCurrent(req, res) {
      const { params: { address } } = req
      delete UserSessions[address][req.session.id]
      let body = {
        deleted: true
      }
      res.send(body)
    },
    
    async deleteAll(req, res) {
      const { params: { address } } = req
      delete UserSessions[address]
      let body = {
        deleted: true
      }
      res.send(body)
    },
  },


  email: {
    async get(req, res) {
      const { params: { address } } = req
      let body = {
        email: UserEmails[address],
      }
      res.send(body)
    },

    async change(req, res) {
      const { params: { address } } = req
      UserEmails[address] = req.body.email
      if (!(address in Users)) {
        Users[address] = {}
      }
      Users[address]['emailExists'] = true
      Users[address]['notificationsEnabled'] = true
      let body = {
        email: req.body.email,
        sent: true
      }
      res.send(body)
    },
    
    async verify(req, res) {
      const { params: { address } } = req
      Users[address]['emailVerified'] = true
      let body = {
        verified: true
      }
      res.send(body)
    },
    
    async send(req, res) {
      const { params: { address } } = req
      let body = {
        sent: true
      }
      res.send(body)
    },
    
    async delete(req, res) {
      const { params: { address } } = req
      delete UserEmails[address]
      Users[address]['emailExists'] = false
      Users[address]['emailVerified'] = false
      Users[address]['notificationsEnabled'] = false
      let body = {
        deleted: true
      }
      res.send(body)
    },
  },


  notifications: { 
    async change(req, res) {
      const { params: { address } } = req
      Users[address]['notificationsEnabled'] = req.body.enabled
      let body = {
        enabled: req.body.enabled
      }
      res.send(body)
    },
  },


  async exists(request, response) {
    const address = request.params.address.toLowerCase()
    const exists = await UserAddress.exists(address)
    response.status(200).send({ exists })
  },

  async create(request, response) {
    const params = request.body
    const errors = await UsersValidator.validateForCreate(params)
    if (errors.length > 0) throw HttpError._400({ errors })

    const email = params.email.toLowerCase()
    let user = await User.findOne({ where: { email }, include: [{ model: UserAddress, as: 'addresses' }] })
    if (!user) user = await User.create({ email })

    const address = params.address.toLowerCase()
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
