module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.createTable('ErrorLogs',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        context: {
          allowNull: false,
          type: Sequelize.TEXT
        },
        message: {
          allowNull: false,
          type: Sequelize.TEXT,
        },
        stack: {
          allowNull: false,
          type: Sequelize.TEXT,
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
    queryInterface.dropTable('ErrorLogs')
}
