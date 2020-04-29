import { Users } from '../models/objection'

export default {
  async get(req, res) {
    const { params: { address } } = req
    const user = await Users.query().findOne({address}).withGraphFetched('email')
    res.send({
      email: user?.email?.email ?? null,
    })
  },

  async set(req, res) {
    const { params: { address }, body } = req
    const user = await Users.query().findOne({address}).withGraphFetched('email')
    if (!user.email || user.email.email != body.email) {
      await user.$relatedQuery('emailVerificationToken').del()
      await user.$relatedQuery('emailVerificationToken').insert({email: body.email, token: 'dummy'})
    }
    await user.$relatedUpdateOrInsert('email', {email: body.email})
    res.send({
      email: body.email,
      sent: true
    })
  },

  async verify(req, res) {
    const { params: { address } } = req
    const user = await Users.query().findOne({address})
    await user.$relatedQuery('emailVerificationToken').del()
    res.send({
      verified: true
    })
  },

  async send(req, res) {
    res.send({
      sent: true
    })
  },

  async delete(req, res) {
    const { params: { address } } = req
    const user = await Users.query().findOne({address})
    await user.$relatedQuery('email').del()
    await user.$relatedQuery('emailVerificationToken').del()
    await user.$relatedQuery('notificationSettings').del()
    res.send({
      deleted: true
    })
  },
}
