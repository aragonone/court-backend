export default (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }

  if (err instanceof SyntaxError) {
    return res.status(400).send({ error: 'Make sure your request is a well formed JSON' })
  }

  if (err.message.includes('CORS')) {
    return res.status(400).send({ error: err.message })
  }

  console.error(err.stack)
  res.status(500).send('Something went wrong :(')
}
