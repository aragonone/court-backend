import 'core-js/stable'
import 'regenerator-runtime/runtime'

import dotenv from 'dotenv'
import helmet from 'helmet'
import morgan from 'morgan'
import express from 'express'
import bodyParser from 'body-parser'
import { createServer } from '@promster/server'
import { createMiddleware, signalIsUp } from '@promster/express'

import routes from './routes'
import errorHandler from './errors/error-handler'
import corsMiddleware from './helpers/cors-middleware'
import sessionMiddleware from './helpers/session-middleware'
import notFoundMiddleware from './helpers/not-found-middleware'

// Load env variables and check DB connection
dotenv.config()

// Set up express layers
const app = express()
app.use(createMiddleware({ app }))
app.use(helmet())
app.use(corsMiddleware)
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(sessionMiddleware())
routes(app)
app.use(notFoundMiddleware())
app.use(errorHandler(app))

// Start main server
const serverPort = process.env.SERVER_PORT || 8000
app.listen(serverPort, error => {
  if (error) return console.error(error)
  signalIsUp()
  console.log(`Server listening on port ${serverPort}`)
})

// Start Prometheus metrics
const metricsPort = process.env.SERVER_METRICS_PORT || 9091
createServer({ port: metricsPort }).then(() =>
  console.log(`Metrics server started on port ${metricsPort}`)
)
