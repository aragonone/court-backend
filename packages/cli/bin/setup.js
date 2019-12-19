const yargs = require('yargs')
const { bn } = require('@aragon/court-backend-shared/helpers/numbers')
const { execSync } = require('child_process')
const CourtProvider = require('../src/models/CourtProvider')
const errorHandler = require('../src/helpers/errorHandler')
const Logger = require('@aragon/court-backend-shared/helpers/logger')

Logger.setDefaults(false, false)
const logger = Logger('setup')

const { network, jurors: jurorsNumber, disputes } = yargs
  .help()
  .option('network', { alias: 'n', describe: 'Network name', type: 'string', demand: true })
  .option('jurors', { alias: 'j', describe: 'Number of jurors to activate', type: 'string', default: 5 })
  .option('disputes', { alias: 'd', describe: 'Number of disputes to create', type: 'string', default: 5 })
  .strict()
  .argv

async function setup() {
  const court = await CourtProvider.for(network)
  const environment = court.environment
  const allAccounts = await environment.getAccounts()
  const sender = allAccounts[0]
  const jurors = allAccounts.slice(1, Math.min(parseInt(jurorsNumber) + 1, allAccounts.length))

  // update term if necessary
  execSync('npm run rpc:heartbeat')

  // mint, stake and activate tokens for every juror
  execSync(`npm run rpc:mint -- -t anj -a 100000000 -r ${sender}`)
  for (let i = 0; i < jurors.length; i++) {
    const juror = jurors[i]
    const amount = (i + 1) * 10000
    execSync(`npm run rpc:stake -- -a ${amount} -j ${juror}`)
    execSync(`npm run rpc:activate -- -a ${amount} -f ${juror}`)
  }

  // check court has started
  const currentTerm = await court.currentTerm()
  const neededTransitions = await court.neededTransitions()
  if (currentTerm.eq(bn(0)) && neededTransitions.eq(bn(0))) {
    logger.warn('Court has not started yet, please make sure Court is at term 1 to create disputes and run the script again.')
  } else {

    // subscribe arbitrables
    const arbitrables = []
    for (let i = 0; i < disputes; i++) {
      execSync(`npm run rpc:mint -- -t fee -a 100000 -f ${sender}`)
      const output = execSync(`npm run rpc:arbitrable`)
      const arbitrable = output.toString().match(/0x[a-fA-F0-9]{40}/g)
      arbitrables.push(arbitrable)
      execSync(`npm run rpc:subscribe -- -a ${arbitrable}`)
    }

    // create disputes
    for (let i = 0; i < disputes; i++) {
      const arbitrable = arbitrables[i]
      execSync(`npm run rpc:mint -- -t fee -a 5000 -r ${arbitrable}`)
      execSync(`npm run rpc:dispute -- -s ${arbitrable} -m 'Testing dispute #${i}' -e 'http://github.com/aragon/aragon-court' 'http://google.com'`)
    }
  }
}

setup().then(() => process.exit(0)).catch(errorHandler)
