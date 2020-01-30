module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.createTable('Settlements',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        disputeId: {
          unique: true,
          allowNull: false,
          type: Sequelize.STRING,
        },
        blockNumber: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        settled: {
          allowNull: false,
          type: Sequelize.BOOLEAN,
          default: false,
        },
        tries: {
          allowNull: false,
          type: Sequelize.INTEGER,
          default: 0,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        }
      }
    ),

  down: (queryInterface, Sequelize) =>
    queryInterface.dropTable('Settlements')
}
