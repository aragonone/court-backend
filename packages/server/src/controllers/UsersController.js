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
    let body = {
      "emailExists": false,
      "emailVerified": false,
      "addressVerified": false,
      "notificationsEnabled": false
    }
    Object.assign(body, Users[req.params.address])
    res.send(body)
  },


  sessions: {
    async create(req, res) {
      if (!(req.params.address in Users)) {
        Users[req.params.address] = {}
      }
      Users[req.params.address]['addressVerified'] = true
      if (!(req.params.address in UserSessions)) {
        UserSessions[req.params.address] = {}
      }
      UserSessions[req.params.address][req.session.id] = true
      let body = {
        "authenticated": true
      }
      res.send(body)
    },

    async authenticate(req,res,next) {
      if (
        !(req.params.address in UserSessions) ||
        !(req.session.id in UserSessions[req.params.address])
      ) {
        // exception for new emails from anj
        if (req.path.endsWith("/email") && !(req.params.address in Users)) {
          return next()
        }
        const errors = [{access: `Unauthorized, please authenticate at /users/${req.params.address}/sessions`}]
        throw HttpError._403({ errors })
      }
      next()
    },
    
    async deleteCurrent(req, res) {
      delete UserSessions[req.params.address][req.session.id]
      let body = {
        "deleted": true
      }
      res.send(body)
    },
    
    async deleteAll(req, res) {
      delete UserSessions[req.params.address]
      let body = {
        "deleted": true
      }
      res.send(body)
    },
  },


  email: {
    async get(req, res) {
      let body = {
        "email": UserEmails[req.params.address],
      }
      res.send(body)
    },

    async change(req, res) {
      UserEmails[req.params.address] = req.body.email
      if (!(req.params.address in Users)) {
        Users[req.params.address] = {}
      }
      Users[req.params.address]['emailExists'] = true
      Users[req.params.address]['notificationsEnabled'] = true
      let body = {
        "email": req.body.email,
        "sent": true
      }
      res.send(body)
    },
    
    async verify(req, res) {
      Users[req.params.address]['emailVerified'] = true
      let body = {
        "verified": true
      }
      res.send(body)
    },
    
    async send(req, res) {
      let body = {
        "sent": true
      }
      res.send(body)
    },
    
    async delete(req, res) {
      delete UserEmails[req.params.address]
      Users[req.params.address]['emailExists'] = false
      Users[req.params.address]['emailVerified'] = false
      Users[req.params.address]['notificationsEnabled'] = false
      let body = {
        "deleted": true
      }
      res.send(body)
    },
  },


  notifications: { 
    async change(req, res) {
      UserEmails[req.params.address] = req.body.enabled
      Users[req.params.address]['notificationsEnabled'] = req.body.enabled
      let body = {
        "enabled": req.body.enabled
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
