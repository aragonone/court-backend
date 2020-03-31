import MetricsReporter from './metrics-reporter'

export default app => (err, req, res, next) => {
  const reporter = MetricsReporter(app)

  if (!res.headersSent) {
    if (err instanceof SyntaxError) {
      res.status(400).send({ error: 'Make sure your request is a well formed JSON' })
    }
    else if (err.message.includes('CORS')) {
      res.status(400).send({ error: err.message })
    }
    else {
      console.error(err.stack)
      res.status(500).send('Something went wrong :(')
    }
  }

  reporter.httpError(res.statusCode)
  next()
}
