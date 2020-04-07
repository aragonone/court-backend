import Models from '../models'
import HttpError from '../errors/http-error'
import asyncMiddleware from '../helpers/async-middleware'

const { Admin } = Models

const authenticate = route => async (request, response, next) => {
  const { session, cookies } = request

  if (!session.modelId || !session.modelType) {
    // Check if user's cookie is still saved in browser and user is not set, then automatically log the user out
    // This usually happens when you stop your express server after login, your cookie still remains saved in the browser
    if (cookies && cookies.aragonCourtSessionID) response.clearCookie('aragonCourtSessionID')
    throw HttpError._403({ error: 'Unauthorized' })
  }

  request.currentAdmin = await Admin.findByPk(session.modelId)
  route(request, response, next)
}

export default route => asyncMiddleware(authenticate(route))
