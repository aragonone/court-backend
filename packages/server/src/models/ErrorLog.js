module.exports = (sequelize, DataTypes) => {
  const ErrorLog = sequelize.define('ErrorLog',
    {
      context: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      stack: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
    }
  )

  ErrorLog.associate = models => {
    ErrorLog.hasOne(models.Reveal, { foreignKey: 'errorId', as: 'reveal' })
    ErrorLog.hasOne(models.Settlement, { foreignKey: 'errorId', as: 'settlement' })
  }

  return ErrorLog
}
