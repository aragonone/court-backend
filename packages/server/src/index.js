import "core-js/stable";
import "regenerator-runtime/runtime";

import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { createMiddleware, signalIsUp } from '@promster/express'
import { createServer } from '@promster/server'

import errorHandler from './helpers/error-handler'
import routes from './routes'
import db from './models'

dotenv.config()

// Check DB connection
db.sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
    process.exit(1)
  });

const corsOptions = {
  origin: function (origin, callback) {
    const whitelist = process.env.CORS_WHITELIST.split(',')
    if (whitelist.indexOf(origin) !== -1) callback(null, true)
    else callback(new Error(`Origin '${origin}' not allowed by CORS`))
  }
}


const app = express()
app.use(createMiddleware({ app }));
app.use(helmet())
app.use(cors(corsOptions))
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

routes(app)

app.get('*', (request, response) => response.status(200).send({ message: 'Welcome to Aragon Court server' }))

app.use(errorHandler)

const port = process.env.PORT || 8000
app.listen(port, (err) => {
  if (err) return console.error(err)
  signalIsUp()
  console.log(`Listening on port ${port}`)
})

const metricsPort = process.env.METRICS_PORT || 8001
createServer({ port: metricsPort }).then(server =>
  console.log(`@promster/server started on port ${metricsPort}.`)
)
