module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define('Session',
    {
      sid: {
        unique: true,
        primaryKey: true,
        type: DataTypes.STRING,
        validate: {
          notEmpty: true,
        }
      },
      modelId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      modelType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      expires: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      data: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      }
    }
  )

  Session.associate = models => {
    Session.belongsTo(models.Admin, { foreignKey: 'modelId', as: 'admin', constraints: false  })
    Session.belongsTo(models.UserAddress, { foreignKey: 'modelId', as: 'user', constraints: false  })
  }

  return Session
}
