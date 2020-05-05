import jwt from 'jsonwebtoken'

const { env: {
  EMAIL_JWT_PRIVATE_KEY,
}} = process

function tokenGenerate(expiresIn='24h') {
  const payload = { timestamp: Date.now() }
  return jwt.sign(payload, EMAIL_JWT_PRIVATE_KEY, {expiresIn})
}

function tokenVerify(token) {
  return jwt.verify(token, EMAIL_JWT_PRIVATE_KEY)
}

export { tokenGenerate, tokenVerify }
