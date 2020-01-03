module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Reveals',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        juror: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        round: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        outcome: {
          allowNull: false,
          type: Sequelize.INTEGER,
        },
        salt: {
          allowNull: false,
          type: Sequelize.STRING,
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
    )

    return queryInterface.addConstraint('Reveals', ['juror', 'round'], {
      type: 'unique',
      name: 'unique_juror_round'
    })
  },

  down: (queryInterface, Sequelize) =>
    queryInterface.dropTable('Reveals')
}
