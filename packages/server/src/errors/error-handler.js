import { DBError } from 'objection'
import HttpError from './http-error'
import MetricsReporter from '../helpers/metrics-reporter'

export default app => (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }

  let code, body

  if (err instanceof HttpError) {
    code = err.code
    body = err.content
  }
  else if (err instanceof SyntaxError) {
    code = 400
    body = { errors: [{ request: 'Make sure your request is a well formed JSON' }] }
  }
  else if (err.message.includes('CORS')) {
    code = 400
    body = { errors: [{ cors: err.message }] }
  }
  else {
    console.error(err.stack)
    code = 500
    body = 'Something went wrong :('

    if (err instanceof DBError) {
      const reporter = MetricsReporter(app)
      reporter.dbError()
    }
  }

  res.status(code).send(body)
}
