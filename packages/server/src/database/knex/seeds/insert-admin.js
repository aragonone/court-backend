require('dotenv').config()
const bcrypt = require('bcryptjs')

const { env: { ADMIN_EMAIL, ADMIN_PASSWORD } } = process
const Admins = require('../../../models/objection/Admins')

exports.seed = function() {
  const admin = Admins.query().where({'email': ADMIN_EMAIL})
  if (!admin) {
    return Admins.query().insert({
      email: ADMIN_EMAIL,
      password: bcrypt.hashSync(ADMIN_PASSWORD),
    })
  }
}
