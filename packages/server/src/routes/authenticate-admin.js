import Models from '../models'
import HttpError from '../errors/http-error'
import asyncMiddleware from '../helpers/async-middleware'

const { Admin } = Models

const authenticate = route => async (request, response, next) => {
  const { session } = request
  if (!session.modelId || !session.modelType) throw HttpError._403({ errors: [{ status: 'Unauthorized' }] })

  request.currentAdmin = await Admin.findByPk(session.modelId)
  route(request, response, next)
}

export default route => asyncMiddleware(authenticate(route))
