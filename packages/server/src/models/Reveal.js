module.exports = (sequelize, DataTypes) => {
  const Reveal = sequelize.define('Reveal',
    {
      voteId: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      juror: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      disputeId: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      roundNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      errorId: {
        type: DataTypes.NUMBER,
        allowNull: true,
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['juror', 'voteId']
        },
      ],
    }
  )
  return Reveal
}
