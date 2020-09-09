import { Prometheus } from '@promster/metrics'
import { createServer } from '@promster/server'

const generalMetrics = {
  worker: [
    { name: 'runs', help: 'Total worker runs' },
    { name: 'success', help: 'Total successful worker runs' },
    { name: 'errors', help: 'Total worker run errors' },
  ]
}
const workerMetrics = {
  heartbeat: { ... generalMetrics },
  reveal: { ... generalMetrics },
  settlements: { ... generalMetrics },
  'monitor-keeper': { ... generalMetrics },
  'notification-scanner': {
    ... generalMetrics,
    notifications: [
      { name: 'scanned', help: 'Total notifications scanned', labelNames: ['scannerName'] },
    ]
  },
  'notification-sender': {
    ... generalMetrics,
    notifications: [
      { name: 'sent', help: 'Total notifications sent', labelNames: ['scannerName'] },
    ]
  },
  'contract-monitor': {
    ... generalMetrics,
    transaction: [
      { name: 'errors', help: 'Total recent transaction errors', labelNames: ['type'], metricType: 'gauge' },
    ]
  }
}

class MetricsReporter {
  constructor(workerName, port) {
    this._defaultLabels = { workerName }
    this._initializeCounterMetrics(workerMetrics[workerName], port)
    this._startServer(port)
  }

  workerRun() {
    this.worker.runs.inc(this._defaultLabels)
  }

  workerSuccess() {
    this.worker.success.inc(this._defaultLabels)
  }

  workerError() {
    this.worker.errors.inc(this._defaultLabels)
  }

  notificationScanned(scannerName) {
    this.notifications.scanned.inc({
      ... this._defaultLabels,
      scannerName
    })
  }

  notificationSent(scannerName) {
    this.notifications.sent.inc({
      ... this._defaultLabels,
      scannerName
    })
  }

  transactionErrors(type, count) {
    this.transaction.errors.set({ type }, count)
  }

  _initializeCounterMetrics(metrics) {
    const { Counter, Gauge, Registry: { globalRegistry: registry } } = Prometheus
    Object.keys(metrics).forEach(type => {
      this[type] = {}
      metrics[type].forEach(({ name, help, labelNames, metricType }) => {
        if (!labelNames) labelNames = []
        labelNames.push('workerName')
        const metricName = `${type}_${name}`
        const metric = registry.getSingleMetric(metricName)
        if (metric) {
          this[type][name] = metric  
        }
        else if (metricType == 'gauge') {
          this[type][name] = new Gauge({ name: metricName, help, labelNames })
        }
        else {
          this[type][name] = new Counter({ name: metricName, help, labelNames })
        }
      })
    })
  }

  _startServer(port) {
    createServer({ port }).then(() =>
      console.log(`Metrics server started on port ${port}`)
    )
  }
}

export default MetricsReporter
