require('dotenv').config()
const bcrypt = require('bcryptjs')

const { env: { ADMIN_EMAIL, ADMIN_PASSWORD } } = process
const Admins = require('../../../models/objection/Admins')

exports.seed = async function() {
  const admin = await Admins.query().findOne({'email': ADMIN_EMAIL})
  if (!admin) {
    return Admins.query().insert({
      email: ADMIN_EMAIL,
      password: bcrypt.hashSync(ADMIN_PASSWORD),
    })
  }
}
