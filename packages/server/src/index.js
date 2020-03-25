import 'core-js/stable'
import 'regenerator-runtime/runtime'

import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { createServer } from '@promster/server'
import { createMiddleware, signalIsUp } from '@promster/express'

import routes from './routes'
import errorHandler from './helpers/error-handler'
import checkConnection from './database/check-connection'

// Load env variables and check DB connection
dotenv.config()
checkConnection().then(console.log)

// Set up allowed CORS origins
const corsOptions = {
  origin: function (origin, callback) {
    const whitelist = process.env.CORS_WHITELIST.split(',')
    if (whitelist.indexOf(origin) !== -1) callback(null, true)
    else callback(new Error(`Origin '${origin}' not allowed by CORS`))
  }
}

// Set up express layers
const app = express()
app.use(createMiddleware({ app }))
app.use(helmet())
app.use(cors(corsOptions))
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Set up custom endpoints and generic error handler
app.get('/', (request, response) => response.status(200).send({ message: 'Welcome to Aragon Court server' }))
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
