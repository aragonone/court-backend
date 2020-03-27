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
    },
    {
      instanceMethods: {
        hasAddress(address) {
          return address !== null && Array.includes(this.addresses.map(a => a.id), address.id)
        }
      },
    }
  )

  User.associate = models => {
    User.hasMany(models.UserAddress, { foreignKey: 'userId', as: 'addresses', onDelete: 'CASCADE' })
  }

  return User
}
