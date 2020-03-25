const yargs = require('yargs')
const { bn } = require('@aragonone/court-backend-shared/helpers/numbers')
const { execSync } = require('child_process')
const errorHandler = require('../src/helpers/error-handler')
const Logger = require('@aragonone/court-backend-shared/helpers/logger')
const Environment = require('@aragonone/court-backend-shared/models/evironments/TruffleEnvironment')

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
  const environment = new Environment(network)
  const court = await environment.getCourt()
  const allAccounts = await environment.getAccounts()
  const sender = allAccounts[0]
  const jurors = allAccounts.slice(1, Math.min(parseInt(jurorsNumber) + 1, allAccounts.length))

  // update term if necessary
  execSync(`node ./bin/index.js heartbeat -n ${network}`)

  // mint, stake and activate tokens for every juror
  execSync(`node ./bin/index.js mint -t anj -a 100000000 -r ${sender} -n ${network}`)
  for (let i = 0; i < jurors.length; i++) {
    const juror = jurors[i]
    const amount = (i + 1) * 10000
    execSync(`node ./bin/index.js stake -a ${amount} -j ${juror} -n ${network}`)
    execSync(`node ./bin/index.js activate -a ${amount} -f ${juror} -n ${network}`)
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
      execSync(`node ./bin/index.js mint -t fee -a 100000 -f ${sender} -n ${network}`)
      const output = execSync(`node ./bin/index.js -n ${network} arbitrable`)
      const arbitrable = output.toString().match(/0x[a-fA-F0-9]{40}/g)
      arbitrables.push(arbitrable)
      execSync(`node ./bin/index.js subscribe -a ${arbitrable} -n ${network}`)
    }

    // create disputes
    for (let i = 0; i < disputes; i++) {
      const arbitrable = arbitrables[i]
      execSync(`node ./bin/index.js mint -t fee -a 5000 -r ${arbitrable} -n ${network}`)
      execSync(`node ./bin/index.js dispute -a ${arbitrable} -m 'Testing dispute #${i}' -e 'http://github.com/aragon/aragon-court' -c -n ${network}`)
    }
  }
}

setup().then(() => process.exit(0)).catch(errorHandler)
