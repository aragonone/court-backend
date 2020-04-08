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

  UserAddress.exists = async address => !!(await UserAddress.findOne({ where: { address }}))

  UserAddress.associate = models => {
    UserAddress.belongsTo(models.User, { foreignKey: { allowNull: false }, as: 'user' })
    UserAddress.hasMany(models.Session, { foreignKey: 'modelId', as: 'sessions', constraints: false, scope: { modelType: 'user' } })
  }

  return UserAddress
}
