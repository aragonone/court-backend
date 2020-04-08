module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.createTable('Sessions',
      {
        sid: {
          unique: true,
          primaryKey: true,
          type: Sequelize.STRING,
        },
        modelId: {
          allowNull: false,
          type: Sequelize.INTEGER,
        },
        modelType: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        expires: {
          allowNull: false,
          type: Sequelize.DATE
        },
        data: {
          allowNull: false,
          type: Sequelize.TEXT,
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

  down: queryInterface =>
    queryInterface.dropTable('Sessions')
}
