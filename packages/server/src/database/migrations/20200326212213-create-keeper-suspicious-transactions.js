module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.createTable('KeeperSuspiciousTransactions',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        blockNumber: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: false,
        },
        txHash: {
          type: Sequelize.STRING,
          allowNull: true,
          unique: true,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      }
    ),

  down: (queryInterface, Sequelize) =>
    queryInterface.dropTable('KeeperSuspiciousTransactions')
}
