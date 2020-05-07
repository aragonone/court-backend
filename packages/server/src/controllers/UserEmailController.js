import HttpError from '../errors/http-error'
import UsersValidator from '../validators/UsersValidator'
import UserEmailVerificationTokenValidator from '../validators/UserEmailVerificationTokenValidator'
import { User } from '../models/objection'

export default {
  async get(req, res) {
    const { params: { address } } = req
    const user = await User.query().findOne({address}).withGraphFetched('email')
    res.send({
      email: user?.email?.email ?? null,
    })
  },

  async set(req, res) {
    const { params: { address }, body: { email } } = req
    const errors = await UsersValidator.validateForEmailSet({address, email})
    if (errors.length > 0) throw HttpError.BAD_REQUEST({errors})
    const user = await User.query().findOne({address})
    await user.$relatedUpdateOrInsert('email', {email})
    await user.$query().update({emailVerified: false})
    await user.$sendVerificationEmail()
    res.send({
      email,
      sent: true
    })
  },

  async verify(req, res) {
    const { params: { address }, body: { token } } = req
    const errors = await UserEmailVerificationTokenValidator.validateForVerify({address, token})
    if (errors.length > 0) throw HttpError.BAD_REQUEST({errors})
    const user = await User.query().findOne({address})
    await user.$relatedQuery('emailVerificationToken').del()
    await user.$query().update({emailVerified: true})
    res.send({
      verified: true
    })
  },

  async resend(req, res) {
    const { params: { address } } = req
    const errors = await UserEmailVerificationTokenValidator.validateForResend({address})
    if (errors.length > 0) throw HttpError.BAD_REQUEST({errors})
    const user = await User.query().findOne({address})
    await user.$sendVerificationEmail()
    res.send({
      sent: true
    })
  },

  async delete(req, res) {
    const { params: { address } } = req
    const user = await User.query().findOne({address})
    await user.$query().update({emailVerified: false})
    await user.$relatedQuery('email').del()
    await user.$relatedQuery('emailVerificationToken').del()
    await user.$relatedQuery('notificationSetting').del()
    res.send({
      deleted: true
    })
  },
}
