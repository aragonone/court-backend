import HttpError from '../errors/http-error'
import UsersValidator from '../validators/UsersValidator'
import UserEmailVerificationTokenValidator from '../validators/UserEmailVerificationTokenValidator'
import { Users } from '../models/objection'
const MINUTES = 60 * 1000
const HOURS = 60 * MINUTES
const DAYS = 24 * HOURS
const EMAIL_TOKEN_EXPIRES = DAYS

export default {
  async get(req, res) {
    const { params: { address } } = req
    const user = await Users.query().findOne({address}).withGraphFetched('email')
    res.send({
      email: user?.email?.email ?? null,
    })
  },

  async set(req, res) {
    const { params: { address }, body: { email } } = req
    const errors = await UsersValidator.validateForEmailSet({address, email})
    if (errors.length > 0) throw HttpError.BAD_REQUEST({errors})
    const user = await Users.query().findOne({address})
    await user.$relatedUpdateOrInsert('email', {email})
    await user.$relatedQuery('emailVerificationToken').del()
    await user.$relatedQuery('emailVerificationToken').insert({
      email,
      token: 'dummy',
      expiresAt: new Date(Date.now()+EMAIL_TOKEN_EXPIRES)
    })
    res.send({
      email,
      sent: true
    })
  },

  async verify(req, res) {
    const { params: { address }, body: { token } } = req
    let errors = await UsersValidator.validateBaseAddress({address})
    if (errors.length > 0) {
      throw HttpError.BAD_REQUEST({errors})
    }
    const user = await Users.query().findOne({address})
    if (!user) {
      throw HttpError.NOT_FOUND({ errors: [{ status: `User ${address} not found` }] })
    }
    errors = await UserEmailVerificationTokenValidator.validateForVerify({address, token})
    if (errors.length > 0) {
      throw HttpError.BAD_REQUEST({errors})
    }
    await user.$relatedQuery('emailVerificationToken').del()
    res.send({
      verified: true
    })
  },

  async resend(req, res) {
    const { params: { address } } = req
    const user = await Users.query().findOne({address}).withGraphFetched('emailVerificationToken')
    if (!user?.emailVerificationToken) {
      const errors = [{token: 'There is no existing verification request'}]
      throw HttpError.BAD_REQUEST({errors})
    }
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
