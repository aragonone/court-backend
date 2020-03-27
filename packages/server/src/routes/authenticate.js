import jwt from 'jsonwebtoken'
import Models from '../models'

const { Admin } = Models
const SECRET_KEY = process.env.SECRET_KEY

export default async function (request, response, next) {
  const token = request.body.token || request.query.token || request.headers['authorization']
  if (!token) return response.status(403).send({ error: 'No token provided' })

  try {
    const decoded = jwt.verify(token, SECRET_KEY)
    const admin = await Admin.findOne({ attributes: ['id', 'email'], where: { email: decoded.admin }})
    if (!admin) return response.status(400).send({ error: 'Authentication failed, admin not found' })
    request.token = token
    request.currentAdmin = admin
    next()
  } catch (error) {
    response.status(403).send({ error: 'Failed to authenticate token' })
  }
}
