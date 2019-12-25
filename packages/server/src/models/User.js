const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User',
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

  const hashPassword = (user, options) => {
    if (user.changed('password')) user.password = bcrypt.hashSync(user.password)
  }

  User.beforeCreate(hashPassword).beforeUpdate(hashPassword)

  return User
}
