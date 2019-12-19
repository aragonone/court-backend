import http from 'http'
import app from '../app'
import dotenv from 'dotenv'

dotenv.config()

const port = parseInt(process.env.PORT, 10) || 8000
app.set('port', port)

const server = http.createServer(app)
server.listen(port)
