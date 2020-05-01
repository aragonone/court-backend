import HttpError from '../errors/http-error'
import UsersValidator from '../validators/UsersValidator'
import { Users } from '../models/objection'

export default {
  async create(req, res) {
    const { session, params: { address } } = req
    let errors = await UsersValidator.validateBaseAddress({address})
    if (errors.length > 0) {
      throw HttpError.BAD_REQUEST({errors})
    }
    const user = await Users.findOneOrInsert({address})
    await user.$query().update({addressVerified: true})
    session.userId = user.id
    res.send({
      authenticated: true
    })
  },

  async deleteCurrent(req, res) {
    req.session.destroy(() => {
      res.send({
        deleted: true
      })
    })
  },

  async deleteAll(req, res) {
    const { params: { address } } = req
    const user = await Users.query().findOne({address})
    await user.$relatedQuery('sessions').del()
    res.send({
      deleted: true
    })
  },
}
