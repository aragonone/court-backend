import HttpError from '../errors/http-error'
import asyncMiddleware from '../helpers/async-middleware'
import Users from '../models/objection/Users'

const authenticate = (route) => async (req, res, next) => {
  const { session: { userId }, params: { address } } = req
  const user = await Users.query().findOne({address})
  if (!userId || !user) {
    const errors = [{access: `Unauthorized, please authenticate at /users/${address}/sessions`}]
    throw HttpError.UNAUTHORIZED({errors})
  } else if (userId != user.id) {
    const errors = [{access: `You don't have permission to edit user ${address}`}]
    throw HttpError.FORBIDDEN({errors})
  }
  route(req, res, next)
}

export default (route) => asyncMiddleware(authenticate(route))
