module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.changeColumn('Sessions', 'modelId', {
      type: Sequelize.STRING,
      allowNull: false,
    }),

  down: (queryInterface, Sequelize) =>
    queryInterface.changeColumn('Sessions', 'modelId', {
      type: Sequelize.INTEGER,
      allowNull: false,
    }),
}
