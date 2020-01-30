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
    }
  )

  Settlement.lastBlockNumber = async () => {
    const settlement = await Settlement.findOne({ attributes: ['blockNumber'], group: ['id'], order: [sequelize.fn('max', sequelize.col('blockNumber'))] })
    return settlement ? settlement.blockNumber : null
  }

  return Settlement
}
