import { Admin } from '../models/objection'
import HttpError from '../errors/http-error'
import asyncMiddleware from '../helpers/async-middleware'

const authenticate = route => async (request, response, next) => {
  const { session } = request
  if (!session.adminId) throw HttpError.UNAUTHORIZED({ errors: [{ access: 'Unauthorized' }] })

  request.currentAdmin = await Admin.findById(session.adminId)
  await route(request, response, next)
}

export default route => asyncMiddleware(authenticate(route))
