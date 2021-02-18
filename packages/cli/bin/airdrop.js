const fs = require('fs')
const path = require('path')
const yargs = require('yargs')
const { execSync } = require('child_process')
const errorHandler = require('../src/helpers/error-handler')
const Logger = require('@1hive/celeste-backend-shared/helpers/logger')
const Environment = require('@1hive/celeste-backend-shared/models/environments/TruffleEnvironment')

Logger.setDefaults(false, false)
const logger = Logger('airdrop')

const { network, input, from, output: outputDir } = yargs
  .help()
  .option('network', { alias: 'n', describe: 'Network name', type: 'string', demand: true })
  .option('input', { alias: 'i', describe: 'Input csv file with the list of jurors with their respective amount of ANJ (without decimals!) to be airdrop', type: 'string', demand: true })
  .option('output', { alias: 'o', describe: 'Dir where the the output file will be stored', type: 'string', default: './', demand: true })
  .option('from', { alias: 'f', describe: 'Sender address', type: 'string' })
  .strict()
  .argv

const outputPath = path.resolve(process.cwd(), `${outputDir}/airdrop.${network}.json`)

function readInput() {
  const content = fs.readFileSync(input)
  const lines = content.toString().split('\n').slice(1)

  const data = lines.map(line => {
    const [address, amount] = line.replace(' ', '').split(',')
    return { address, amount }
  })

  if (data[data.length - 1].amount === undefined) data.pop()
  return data
}

async function airdrop() {
  const jurors = readInput()
  const environment = new Environment(network, from)
  const court = await environment.getCourt()
  const output = []

  for (const juror of jurors) {
    if (juror.address && juror.amount) {
      const { address, amount } = juror
      try {
        const receipt = await court.activateFor(address, amount)
        logger.success(`Activated ANJ ${amount} for ${address} successfully`)
        output.push({ address, amount, txHash: receipt.hash })
      } catch (error) {
        logger.error(`Failed to activate ANJ ${amount} for ${address}`)
        output.push({ address, amount, error: error.message })
      }
      const data = JSON.stringify(output, null, 2)
      fs.writeFileSync(outputPath, data)
    }
    else logger.warn('Skipping entry')
  }
}

airdrop().then(() => process.exit(0)).catch(errorHandler)
