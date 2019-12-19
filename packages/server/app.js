import routes from './src/routes'
import morgan from 'morgan'
import express from 'express'
import bodyParser from 'body-parser'
import errorHandler from './src/helpers/error-handler'

const app = express()
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

routes(app)

app.get('*', (request, response) => response.status(200).send({ message: 'Welcome to Aragon Court server' }))

app.use(errorHandler)

export default app
