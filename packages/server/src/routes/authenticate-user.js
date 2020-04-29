import HttpError from '../errors/http-error'
import asyncMiddleware from '../helpers/async-middleware'
import Users from '../models/objection/Users'

const authenticate = (route) => async (req, res, next) => {
  const { session: { userId }, params: { address } } = req
  const user = await Users.query().findOne({address})
  if (!userId || !user || userId != user.id) {
    const errors = [{access: `Unauthorized, please authenticate at /users/${address}/sessions`}]
    throw HttpError._403({errors})
  }
  route(req, res, next)
}

export default (route) => asyncMiddleware(authenticate(route))
