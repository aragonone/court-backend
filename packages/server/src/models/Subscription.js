module.exports = (sequelize, DataTypes) =>
  sequelize.define('Subscription',
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          isEmail: true
        }
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      }
    },
    {
      indexes: [
        {
          unique: false,
          fields: ['email', 'address']
        },
      ],
    }
  )
