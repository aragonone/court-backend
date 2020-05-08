import HttpError from '../errors/http-error'
import asyncMiddleware from '../helpers/async-middleware'
import { User } from '../models/objection'

const authenticate = (route) => async (req, res, next) => {
  const { session: { userId }, params: { address } } = req
  const user = await User.query().findOne({address})
  if (!user) {
    const errors = [{address: `User ${address} not found` }]
    throw HttpError.NOT_FOUND({errors})
  }
  if (!userId) {
    const errors = [{access: `Unauthorized, please authenticate at /users/${address}/sessions`}]
    throw HttpError.UNAUTHORIZED({errors})
  }
  if (userId != user.id) {
    const errors = [{access: `You don't have permission to edit user ${address}`}]
    throw HttpError.FORBIDDEN({errors})
  }
  await route(req, res, next)
}

export default (route) => asyncMiddleware(authenticate(route))
