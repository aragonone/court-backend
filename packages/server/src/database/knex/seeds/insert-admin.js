require('dotenv').config()
const bcrypt = require('bcryptjs')
const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

exports.seed = function(knex) {
  return knex('Admins').where({'email': ADMIN_EMAIL}).then(function(rows) {
    if (!rows.length) {
      return knex('Admins').insert({
        email: ADMIN_EMAIL,
        password: bcrypt.hashSync(ADMIN_PASSWORD),
      })
    }
  })
}
