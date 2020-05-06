import jwt from 'jsonwebtoken'

const { env: {
  EMAIL_JWT_PRIVATE_KEY,
}} = process

function generateToken(expiresIn = '24h') {
  const payload = { timestamp: Date.now() }
  return jwt.sign(payload, EMAIL_JWT_PRIVATE_KEY, { expiresIn })
}

function isTokenValid(token) {
  try {
    jwt.verify(token, EMAIL_JWT_PRIVATE_KEY)
    return true
  } catch {
    return false
  }
}

export { generateToken, isTokenValid }
