import jwt from 'jsonwebtoken'
import Models from '../models'
import UserValidator from '../validators/UserValidator'

const { User } = Models
const SECRET_KEY = process.env.SECRET_KEY

export default {
  async login(request, response, next) {
    try {
      const errors = await UserValidator.validateForLogin(request.body)
      if (errors.length > 0) return response.status(400).send({ errors: errors })

      const token = jwt.sign({ user: request.body.email }, SECRET_KEY, { expiresIn: 3600 })
      return response.status(200).send({ token })
    } catch(error) {
      next(error)
    }
  },

  async all(request, response, next) {
    try {
      const { query } = request
      const page = query.page || 0
      const limit = query.limit || 20
      const offset = page * limit

      const users = await User.findAll({ limit, offset, order: [['createdAt', 'DESC']] })
      response.status(200).send({ users })
    } catch(error) {
      next(error)
    }
  },

  async create(request, response, next) {
    try {
      const errors = await UserValidator.validateForCreate(request.body)
      if (errors.length > 0) return response.status(400).send({ errors: errors })

      const user = await User.create(request.body)
      user.password = undefined
      response.status(200).send(user)
    } catch(error) {
      next(error)
    }
  },

  async delete(request, response, next) {
    try {
      const id = request.params.id
      const errors = await UserValidator.validateForDelete(id)
      if (errors.length > 0) return response.status(400).send({ errors: errors })

      const user = await User.findById(id)
      await user.destroy()
      response.status(200).send()
    } catch(error) {
      next(error)
    }
  },
}
