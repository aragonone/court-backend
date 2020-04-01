import HttpError from './http-error'
import MetricsReporter from '../helpers/metrics-reporter'

export default app => (err, req, res, next) => {
  const reporter = MetricsReporter(app)

  if (res.headersSent) {
    reporter.httpError(res.statusCode, error.message)
    return next(err)
  }

  let code, body

  if (err instanceof HttpError) {
    code = err.code
    body = err.content
  }
  else if (err instanceof SyntaxError) {
    code = 400
    body = { error: 'Make sure your request is a well formed JSON' }
  }
  else if (err.message.includes('CORS')) {
    code = 400
    body = { error: err.message }
  }
  else {
    console.error(err.stack)
    code = 500
    body = 'Something went wrong :('
  }

  reporter.httpError(code, body)
  res.status(code).send(body)
}
