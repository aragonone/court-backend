import { Admin } from '../models/objection'
import HttpError from '../errors/http-error'
import AdminValidator from '../validators/AdminValidator'

export default {
  async login(request, response) {
    const { body, session } = request

    if (session.adminId) {
      const admin = await Admin.findById(session.adminId)
      return response.status(200).send({ admin })
    }

    const errors = await AdminValidator.validateForLogin(body)
    if (errors.length > 0) throw HttpError.BAD_REQUEST({ errors })

    const admin = await Admin.findByEmail(body.email)
    session.adminId = admin.id
    return response.status(200).send({ admin })
  },

  async logout(request, response) {
    await request.session.destroy()
    response.status(200).send()
  },

  async me(request, response) {
    response.status(200).send({ admin: request.currentAdmin })
  },

  async all(request, response) {
    const { query } = request
    const page = query.page || 0
    const pageSize = query.limit || 20

    const adminsPage = await Admin.query().orderBy('createdAt', 'DESC').page(page, pageSize)
    response.status(200).send(adminsPage)
  },

  async create(request, response) {
    const errors = await AdminValidator.validateForCreate(request.body)
    if (errors.length > 0) throw HttpError.BAD_REQUEST({ errors })

    const admin = await Admin.create(request.body)
    admin.password = undefined
    response.status(200).send(admin)
  },

  async delete(request, response) {
    const id = request.params.id
    const errors = await AdminValidator.validateForDelete(id)
    if (errors.length > 0) throw HttpError.BAD_REQUEST({ errors })

    const admin = await Admin.findById(id)
    await admin.destroy()
    response.status(200).send()
  },
}
