const bcrypt = require('bcryptjs')

const hashPassword = admin => {
  if (admin.changed('password')) {
    admin.password = bcrypt.hashSync(admin.password)
  }
}

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
    }
  )

  Admin.prototype.hasPassword = function (password) {
    return bcrypt.compareSync(password, this.password)
  }

  Admin.countByEmail = async email => Admin.count({ where: { email } })
  Admin.findByEmail = async email => Admin.findOne({ where: { email } })
  Admin.allEmails = async () => (await Admin.findAll({ attributes: ['email'] })).map(admin => admin.email)

  Admin.associate = models => {
    Admin.hasMany(models.Session, { foreignKey: 'modelId', as: 'sessions', constraints: false, scope: { modelType: 'admin' } })
  }

  Admin.beforeCreate(hashPassword).beforeUpdate(hashPassword)

  return Admin
}
