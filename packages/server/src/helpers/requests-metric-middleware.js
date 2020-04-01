import metricsReporter from '../helpers/metrics-reporter'

export default app => (request, response, next) => {
  const reporter = metricsReporter(app)
  reporter.httpRequest(request)
  next()
}
