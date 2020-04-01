import HttpError from './http-error'

export default (err, req, res, next) => {
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

  res.status(code).send(body)
}
