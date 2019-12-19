module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Subscriptions',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        email: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        address: {
          allowNull: true,
          type: Sequelize.STRING,
        },
        amount: {
          allowNull: true,
          type: Sequelize.STRING,
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
    queryInterface.dropTable('Subscriptions')
}
