import HttpError from '../errors/http-error'
import UsersValidator from '../validators/UsersValidator'
import { User, UserEmail } from '../models/objection'

export default {
  async details(req, res) {
    const { params: { address } } = req
    const errors = await UsersValidator.validateBaseAddress({address})
    if (errors.length > 0) throw HttpError.BAD_REQUEST({errors})
    const user = await User.query().findOne({address}).withGraphFetched('[email, emailVerificationToken, notificationSettings]')
    res.send({
      emailExists: !!user?.email,
      emailVerified: !!user?.email && !user?.emailVerificationToken && !!user?.addressVerified,
      addressVerified: !!user?.addressVerified,
      notificationsDisabled: !!user?.notificationSetting?.notificationsDisabled
    })
  },

  async create(req, res) {
    const params = req.body
    const errors = await UsersValidator.validateForCreate(params)
    if (errors.length > 0) throw HttpError.BAD_REQUEST({errors})
    const { email, address } = params
    const userEmail = await UserEmail.findOneOrInsert({email})
    await userEmail.$relatedQuery('users').insert({address})
    res.send({
      created: true
    })
  },

  async all(req, res) {
    const page = req.query.page || 0
    const pageSize = req.query.limit || 20

    const usersPage = await User.query().orderBy('createdAt', 'DESC').withGraphFetched('email').page(page, pageSize)
    res.send(usersPage)
  }
}
