const COUNTER_METRICS = {
  db: [
    { name: 'queries', help: 'DB queries per table' },
    { name: 'errors', help: 'DB errors' },
  ],
  email: [
    { name: 'errors', help: 'Total email errors' },
  ]
}

class MetricsReporter {
  constructor(app) {
    this._initializeCounterMetrics(app)
  }

  dbQuery() {
    this.db.queries.inc()
  }

  dbError() {
    this.db.errors.inc()
  }

  emailError() {
    this.email.errors.inc()
  }

  _initializeCounterMetrics(app) {
    const { locals: { Prometheus: { Counter, Registry: { globalRegistry: registry } } } } = app

    Object.keys(COUNTER_METRICS).forEach(type => {
      this[type] = {}
      COUNTER_METRICS[type].forEach(({ name, help, labelNames }) => {
        const metricName = `${type}_${name}`
        const metric = registry.getSingleMetric(metricName)
        this[type][name] = metric || new Counter({ name: metricName, help, labelNames })
      })
    })
  }
}

export default app => new MetricsReporter(app)
