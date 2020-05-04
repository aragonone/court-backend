import jwt from 'jsonwebtoken'

const { env: {
  EMAIL_JWT_PRIVATE_KEY,
}} = process

function tokenGenerate() {
  const payload = { timestamp: Date.now() }
  return jwt.sign(payload, EMAIL_JWT_PRIVATE_KEY, {expiresIn: '24h'})
}

function tokenVerify(token) {
  return jwt.verify(token, EMAIL_JWT_PRIVATE_KEY)
}

export { tokenGenerate, tokenVerify }
