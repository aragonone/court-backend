import 'core-js/stable'
import 'regenerator-runtime/runtime'

import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { createServer } from '@promster/server'
import { createMiddleware, signalIsUp } from '@promster/express'

import routes from './routes'
import errorHandler from './errors/error-handler'
import corsMiddleware from './helpers/cors-middleware'
import checkConnection from './database/check-connection'

// Load env variables and check DB connection
dotenv.config()
checkConnection().then(console.log)

// Set up express layers
const app = express()
app.use(createMiddleware({ app }))
app.use(helmet())
app.use(corsMiddleware)
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
routes(app)
app.use(errorHandler)

// Start main server
const serverPort = process.env.SERVER_PORT || 8000
app.listen(serverPort, error => {
  if (error) return console.error(error)
  signalIsUp()
  console.log(`Listening on port ${serverPort}`)
})

// Start Prometheus metrics
const metricsPort = process.env.SERVER_METRICS_PORT || 9091
createServer({ port: metricsPort }).then(() =>
  console.log(`@promster/server started on port ${metricsPort}.`)
)
