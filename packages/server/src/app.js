import routes from './routes'
import cors from 'cors'
import morgan from 'morgan'
import express from 'express'
import bodyParser from 'body-parser'
import errorHandler from './helpers/error-handler'

const corsOptions = {
  origin: function (origin, callback) {
    const whitelist = process.env.CORS_WHITELIST.split(',')
    if (whitelist.indexOf(origin) !== -1) callback(null, true)
    else callback(new Error('Not allowed by CORS'))
  }
}

const app = express()
app.use(cors(corsOptions))
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

routes(app)

app.get('*', (request, response) => response.status(200).send({ message: 'Welcome to Aragon Court server' }))

app.use(errorHandler)

export default app
