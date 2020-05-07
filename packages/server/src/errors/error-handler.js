import { DBError } from 'objection'
import HttpStatus from 'http-status-codes'
import { Errors as PostmarkErrors } from 'postmark'

import HttpError from './http-error'
import MetricsReporter from '../helpers/metrics-reporter'

export default app => (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }

  const reporter = MetricsReporter(app)
  let code, body

  if (err instanceof HttpError) {
    code = err.code
    body = err.content
  }
  else if (err instanceof SyntaxError) {
    code = HttpStatus.BAD_REQUEST
    body = { errors: [{ request: 'Make sure your request is a well formed JSON' }] }
  }
  else if (err instanceof PostmarkErrors.PostmarkError) {
    code = HttpStatus.INTERNAL_SERVER_ERROR
    body = { errors: [{ email: 'Could not send email.' }] }
    console.error(err.stack)
    reporter.emailError()
  }
  else if (err.message.includes('CORS')) {
    code = HttpStatus.BAD_REQUEST
    body = { errors: [{ cors: err.message }] }
  }
  else {
    console.error(err.stack)
    code = HttpStatus.INTERNAL_SERVER_ERROR
    body = 'Something went wrong :('

    if (err instanceof DBError) {
      reporter.dbError()
    }
  }

  res.status(code).send(body)
  console.error(JSON.stringify(body))
}
