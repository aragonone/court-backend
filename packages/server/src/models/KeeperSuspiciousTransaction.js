module.exports = (sequelize, DataTypes) => {
  const KeeperSuspiciousTransaction = sequelize.define('KeeperSuspiciousTransaction',
    {
      blockNumber: {
        type: DataTypes.STRING,
        unique: false,
        allowNull: false,
        validate: { notEmpty: true }
      },
      txHash: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
        validate: { notEmpty: true }
      },
    },
  )

  KeeperSuspiciousTransaction.last = async () => {
    const txs = await KeeperSuspiciousTransaction.findAll({ limit: 1, order: [[ 'createdAt', 'DESC' ]] })
    return txs[0]
  }

  KeeperSuspiciousTransaction.lastInspectedBlockNumber = async () => {
    const tx = await KeeperSuspiciousTransaction.last()
    return tx ? tx.blockNumber : 0
  }

  return KeeperSuspiciousTransaction
}
