import jwt from 'jsonwebtoken'
import Models from '../models'
import HttpError from '../errors/http-error'
import AdminValidator from '../validators/AdminValidator'

const { Admin } = Models
const SECRET_KEY = process.env.SECRET_KEY

export default {
  async login(request, response) {
    const errors = await AdminValidator.validateForLogin(request.body)
    if (errors.length > 0) throw HttpError._400({ errors })

    const token = jwt.sign({ admin: request.body.email }, SECRET_KEY, { expiresIn: 3600 })
    response.status(200).send({ token })
  },

  async me(request, response) {
    response.status(200).send({ admin: request.currentAdmin })
  },

  async all(request, response) {
    const { query } = request
    const page = query.page || 0
    const limit = query.limit || 20
    const offset = page * limit

    const admins = await Admin.findAll({ limit, offset, order: [['createdAt', 'DESC']] })
    response.status(200).send({ admins })
  },

  async create(request, response) {
    const errors = await AdminValidator.validateForCreate(request.body)
    if (errors.length > 0) throw HttpError._400({ errors })

    const admin = await Admin.create(request.body)
    admin.password = undefined
    response.status(200).send(admin)
  },

  async delete(request, response) {
    const id = request.params.id
    const errors = await AdminValidator.validateForDelete(id)
    if (errors.length > 0) throw HttpError._400({ errors })

    const admin = await Admin.findByPk(id)
    await admin.destroy()
    response.status(200).send()
  },
}
