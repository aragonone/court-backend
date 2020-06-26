const fs = require('fs')
const path = require('path')
const yargs = require('yargs')
const { toChecksumAddress } = require('web3-utils')
const { bn } = require('@aragonone/court-backend-shared/helpers/numbers')
const Logger = require('@aragonone/court-backend-shared/helpers/logger')
const Environment = require('@aragonone/court-backend-shared/models/environments/TruffleEnvironment')
const errorHandler = require('../src/helpers/error-handler')

Logger.setDefaults(false, true)
const logger = Logger('fees')

const { network, period } = yargs
  .help()
  .option('period', { alias: 'p', describe: 'Period ID', type: 'string', default: '0' })
  .option('network', { alias: 'n', describe: 'Network name', type: 'string', demand: true, default: 'mainnet' })
  .strict()
  .argv

async function setup() {
  const environment = new Environment(network)
  const court = await environment.getCourt()

  const result = await environment.query(`{ jurors (first: 1000) { id } }`)
  logger.info(`Checking ${result.jurors.length} jurors`)

  const { balanceCheckpoint } = await court.getPeriod(period)
  logger.info(`Using balance checkpoint: ${balanceCheckpoint}`)

  const eligibles = [], notEligibles = []
  const registry = await court.registry()
  const subscriptions = await court.subscriptions()

  for (const { id } of result.jurors) {
    const juror = toChecksumAddress(id)
    const { jurorShare } = await subscriptions.getJurorShare(juror, period)
    const activeBalance = await registry.activeBalanceOfAt(juror, balanceCheckpoint)

    if (jurorShare.eq(bn(0))) {
      logger.info(`Juror ${juror} is not eligible for fees`)
      notEligibles.push({ juror, activeBalance: activeBalance.toString() })
      if (!activeBalance.eq(bn(0))) logger.warn(`Juror ${juror} is not eligible but has ${activeBalance.toString()} active at term ${balanceCheckpoint}`)
    }
    else {
      logger.info(`Juror ${juror} is eligible for fees`)
      const activeBalance = await registry.activeBalanceOfAt(juror, balanceCheckpoint)
      eligibles.push({ juror, activeBalance: activeBalance.toString() })
    }
  }

  logger.success(`There are ${eligibles.length} jurors eligible for fees: \n- ${eligibles.map(e => e.juror).join('\n- ')}`)

  const outputPath = path.resolve(process.cwd(), `./subscription-fees.${network}.json`)
  const data = JSON.stringify({ eligibles, notEligibles }, null, 2)
  fs.writeFileSync(outputPath, data)
}

setup().then(() => process.exit(0)).catch(errorHandler)
