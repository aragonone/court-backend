module.exports = (sequelize, DataTypes) => {
  const UserAddress = sequelize.define('UserAddress',
    {
      address: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      }
    }
  )

  UserAddress.associate = models => {
    UserAddress.belongsTo(models.User, { foreignKey: { allowNull: false }, as: 'user' })
  }

  return UserAddress
}
