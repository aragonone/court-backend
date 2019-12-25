require('dotenv').config()
const bcrypt = require('bcryptjs')

const EMAIL = process.env.ADMIN_EMAIL
const PASSWORD = process.env.ADMIN_PASSWORD

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [{
      email: EMAIL,
      password: bcrypt.hashSync(PASSWORD),
      createdAt: Sequelize.literal('NOW()'),
      updatedAt: Sequelize.literal('NOW()'),
    }])
  },

  down(queryInterface, Sequelize) {
    // do nothing
  }
}
