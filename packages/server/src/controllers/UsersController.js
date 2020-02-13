import Models from '../models'
import UsersValidator from '../validators/UsersValidator'
import { toChecksumAddress } from 'web3-utils'

const { User, UserAddress } = Models

export default {
  async exists(request, response, next) {
    try {
      const errors = await UsersValidator.validateForCreate(request.query)
      return (errors.length === 0) ? response.status(200) : response.status(400).send({ errors })
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

      const address = toChecksumAddress(params.address)
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
