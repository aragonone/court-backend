const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define('Admin',
    {
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true,
          isEmail: true
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      }
    },
  )

  const hashPassword = (admin, options) => {
    if (admin.changed('password')) admin.password = bcrypt.hashSync(admin.password)
  }

  Admin.allEmails = async () => {
    const admins = Admin.findAll({ attributes: ['email'] })
    return admins.map(admin => admin.email)
  }

  Admin.beforeCreate(hashPassword).beforeUpdate(hashPassword)

  return Admin
}
