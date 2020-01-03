module.exports = (sequelize, DataTypes) =>
  sequelize.define('Reveal',
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
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['juror', 'round']
        },
      ],
    }
  )
