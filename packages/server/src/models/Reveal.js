module.exports = (sequelize, DataTypes) => {
  const Reveal = sequelize.define('Reveal',
    {
      juror: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      round: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      outcome: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      salt: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      revealed: {
        type: DataTypes.STRING,
        allowNull: false,
        default: false,
      },
      tries: {
        type: DataTypes.NUMBER,
        allowNull: false,
        default: 0,
      },
    },
    {
      classMethods: {
        associate: models => {
          Reveal.belongsTo(models.ErrorLogs, { as: 'error' })
        },
      },
      indexes: [
        {
          unique: true,
          fields: ['juror', 'round']
        },
      ],
    }
  )
  return Reveal
}
