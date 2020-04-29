import { Users } from '../models/objection'

export default {
  async create(req, res) {
    const { session, params: { address } } = req
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
