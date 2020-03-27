import Models from '../models'
import UsersValidator from '../validators/UsersValidator'

const { User, UserAddress } = Models

export default {
  async exists(request, response, next) {
    try {
      const address = request.params.address.toLowerCase()
      const exists = await UserAddress.exists(address)
      response.status(200).send({ exists })
    } catch(error) {
      next(error)
    }
  },

  async create(request, response, next) {
    try {
      const params = request.body
      const errors = await UsersValidator.validateForCreate(params)
      if (errors.length > 0) return response.status(400).send({ errors })

      const email = params.email.toLowerCase()
      let user = await User.findOne({ where: { email }, include: [{ model: UserAddress, as: 'addresses' }] })
      if (!user) user = await User.create({ email })

      const address = params.address.toLowerCase()
      const userAddress = await UserAddress.create({ address, userId: user.id })
      user.addresses = (!user.addresses) ? [userAddress] : user.addresses.concat([userAddress])

      response.status(200).send(user)
    } catch(error) {
      next(error)
    }
  },

  async all(request, response, next) {
    try {
      const limit = request.query.limit || 20
      const offset = (request.query.page || 0) * limit

      const total = await User.count()
      const users = await User.findAll({ limit, offset, include: [{ model: UserAddress, as: 'addresses' }], order: [['createdAt', 'DESC']] })
      response.status(200).send({ users, total })
    } catch(error) {
      next(error)
    }
  },
}
