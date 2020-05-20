import HttpError from '../errors/http-error'
import UserSessionsValidator from '../validators/UserSessionsValidator'
import { User } from '../models/objection'

export default {
  async create(req, res) {
    const { session, params: { address }, body: { signature, timestamp } } = req
    const errors = await UserSessionsValidator.validateForCreate({address, signature, timestamp})
    if (errors.length > 0) throw HttpError.BAD_REQUEST({errors})
    const user = await User.findOrInsert({address})
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
    const user = await User.findOne({address})
    await user.$relatedQuery('sessions').del()
    res.send({
      deleted: true
    })
  },
}
