import jwt from 'jsonwebtoken'
import Models from '../models'

const { User } = Models
const SECRET_KEY = process.env.SECRET_KEY

export default async function (request, response, next) {
  const token = request.body.token || request.query.token || request.headers['authorization']
  if (!token) return response.status(403).send({ error: 'No token provided' })

  try {
    const decoded = jwt.verify(token, SECRET_KEY)
    const user = await User.findOne({ attributes: ['id', 'email'], where: { email: decoded.user }})
    if (!user) return response.status(400).send({ error: 'Authentication failed, user not found' })
    request.token = token
    request.currentUser = user
    next()
  } catch (error) {
    return response.status(403).send({ error: 'Failed to authenticate token' })
  }
}
