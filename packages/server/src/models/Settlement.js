module.exports = (sequelize, DataTypes) => {
  const Settlement = sequelize.define('Settlement',
    {
      disputeId: {
        unique: true,
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: false
        }
      },
      blockNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: false
        }
      },
      settled: {
        type: DataTypes.BOOLEAN,
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
    }
  )

  Settlement.lastBlockNumber = () => {
    return Settlement.findOne({ attributes: ['blockNumber'], group: ['id'], order: [sequelize.fn('max', sequelize.col('blockNumber'))] })
  }

  return Settlement
}
