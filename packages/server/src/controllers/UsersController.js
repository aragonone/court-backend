import Models from '../models'
import HttpError from '../errors/http-error'
import UsersValidator from '../validators/UsersValidator'

const { User, UserAddress } = Models

export default {
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
