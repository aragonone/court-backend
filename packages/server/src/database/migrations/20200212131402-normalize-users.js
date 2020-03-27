const Logger = require('@aragonone/court-backend-shared/helpers/logger')
const subscriptionsMigration = require('./20191219135036-create-subscription')
const { isAddress } = require('web3-utils')

Logger.setDefaults(false, false)
const logger = Logger('Migrator')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
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
    )

    await queryInterface.createTable('UserAddresses',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        address: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        userId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Users',
            key: 'id',
            as: 'userId',
          },
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
    )

    console.log('')
    const subscriptions = (await queryInterface.sequelize.query(`SELECT * FROM "Subscriptions" ORDER BY id`))[0]

    for (const { email, address, createdAt, updatedAt } of subscriptions) {
      const parsedEmail = email.toLowerCase()
      const existingUser = (await queryInterface.sequelize.query(`SELECT id FROM "Users" WHERE email='${parsedEmail}'`))[0]

      if (existingUser.length === 0) {
        logger.success(`Inserting new user with email '${parsedEmail}'`)
        await queryInterface.sequelize.query(`INSERT INTO "Users" ("email", "createdAt", "updatedAt") VALUES ('${parsedEmail}', '${createdAt.toUTCString()}', '${updatedAt.toUTCString()}')`)
      }
      else {
        const { id: userId } = existingUser[0]
        logger.warn(`Skipping email '${parsedEmail}', user with ID '${userId}' already has that email address`)
      }

      const { id: userId } = (await queryInterface.sequelize.query(`SELECT id FROM "Users" WHERE email='${parsedEmail}'`))[0][0]
      if (!address) logger.warn(`Skipping address '${address}' for user with ID '${userId}'`)
      else {
        const parsedAddress = address.toLowerCase()
        if (!isAddress(parsedAddress)) logger.warn(`Skipping invalid address '${address}' for user with ID '${userId}'`)
        else {
          const existingAddress = (await queryInterface.sequelize.query(`SELECT * FROM "UserAddresses" WHERE address='${parsedAddress}'`))[0]

          if (existingAddress.length === 0) {
            logger.success(`Inserting new address '${parsedAddress}' for user with ID '${userId}' with email '${parsedEmail}'`)
            await queryInterface.sequelize.query(`INSERT INTO "UserAddresses" ("userId", "address", "createdAt", "updatedAt") VALUES ('${userId}', '${parsedAddress}', '${createdAt.toUTCString()}', '${updatedAt.toUTCString()}')`)
          } else {
            const { id: addressId, userId: addressUserId } = existingAddress[0]
            logger.warn(`Skipping address '${parsedAddress}' for user with ID '${userId}', another user with ID '${addressUserId}' already has that address with ID '${addressId}'`)
          }
        }
      }
    }

    console.log('')
    const usersWithoutAddress = (await queryInterface.sequelize.query(`SELECT email FROM "Users" LEFT JOIN "UserAddresses" ON "Users"."id" = "UserAddresses"."userId" WHERE "UserAddresses"."id" IS NULL`))[0]
    logger.warn('WARNING! The following email do not have an address associated:')
    for (const { email } of usersWithoutAddress) console.log(` - ${email}`)
    console.log('\nPlease clean these manually if needed\n')

    await subscriptionsMigration.down(queryInterface, Sequelize)
  },

  down: async (queryInterface, Sequelize) => {
    await subscriptionsMigration.up(queryInterface, Sequelize)

    console.log('')
    const users = (await queryInterface.sequelize.query(`SELECT "Users"."id" AS id, "UserAddresses"."id" AS "addressId", "email", "address", "Users"."createdAt", "Users"."updatedAt" FROM "Users" LEFT JOIN "UserAddresses" ON "Users"."id" = "UserAddresses"."userId" ORDER BY "Users"."id"`))[0]

    for (const { id, addressId, email, address, createdAt, updatedAt } of users) {
      if (addressId) {
        logger.success(`Inserting new subscription with email '${email}' and address '${address}'`)
        await queryInterface.sequelize.query(`INSERT INTO "Subscriptions" ("email", "address", "createdAt", "updatedAt") VALUES ('${email}', '${address}', '${createdAt.toUTCString()}', '${updatedAt.toUTCString()}')`)
      }
      else {
        logger.warn(`Inserting new subscription with email '${email}' without an address for user with ID ${id}`)
        await queryInterface.sequelize.query(`INSERT INTO "Subscriptions" ("email", "address", "createdAt", "updatedAt") VALUES ('${email}', NULL, '${createdAt.toUTCString()}', '${updatedAt.toUTCString()}')`)
      }
    }

    await queryInterface.dropTable('UserAddresses')
    await queryInterface.dropTable('Users')
  }
}
