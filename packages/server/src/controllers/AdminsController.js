import jwt from 'jsonwebtoken'
import Models from '../models'
import AdminValidator from '../validators/AdminValidator'

const { Admin } = Models
const SECRET_KEY = process.env.SECRET_KEY

export default {
  async login(request, response, next) {
    try {
      const errors = await AdminValidator.validateForLogin(request.body)
      if (errors.length > 0) {
        response.status(400).send({ errors: errors })
        next()
      }
      const token = jwt.sign({ admin: request.body.email }, SECRET_KEY, { expiresIn: 3600 })
      response.status(200).send({ token })
    } catch(error) {
      next(error)
    }
  },

  async me(request, response, next) {
    try {
      response.status(200).send({ admin: request.currentAdmin })
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

      const admins = await Admin.findAll({ limit, offset, order: [['createdAt', 'DESC']] })
      response.status(200).send({ admins })
    } catch(error) {
      next(error)
    }
  },

  async create(request, response, next) {
    try {
      const errors = await AdminValidator.validateForCreate(request.body)
      if (errors.length > 0) {
        response.status(400).send({ errors: errors })
        next()
      }

      const admin = await Admin.create(request.body)
      admin.password = undefined
      response.status(200).send(admin)
    } catch(error) {
      next(error)
    }
  },

  async delete(request, response, next) {
    try {
      const id = request.params.id
      const errors = await AdminValidator.validateForDelete(id)
      if (errors.length > 0) {
        response.status(400).send({ errors: errors })
        next()
      }

      const admin = await Admin.findByPk(id)
      await admin.destroy()
      response.status(200).send()
    } catch(error) {
      next(error)
    }
  },
}
