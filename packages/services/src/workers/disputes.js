import sleep from '@aragon/court-backend-shared/helpers/sleep'
import Models from '@aragon/court-backend-server/build/models'
import Network from '@aragon/court-backend-server/build/web3/Network'

const { Settlement, ErrorLog } = Models

const INITIAL_BLOCK_NUMBER = '10000'
const SECONDS_BETWEEN_INTENTS = 3

export default async function (worker, job, tries, logger) {
  try {
    const court = await Network.getCourt()
    const disputeManager = await court.disputeManager()
    const lastBlockNumber = await Settlement.lastBlockNumber()
    const fromBlock = lastBlockNumber ? parseInt(lastBlockNumber) + 1 : INITIAL_BLOCK_NUMBER
    const { number: toBlock } = await Network.environment.getLastBlock()
    logger.info(`Listening NewDispute events from block ${fromBlock} to block ${toBlock}`)

    await recordEvents(logger, tries, disputeManager, fromBlock, toBlock)
  } catch (error) {
    await ErrorLog.create({ context: `Worker '${worker}' job #${job}`, message: error.message, stack: error.stack })
    throw error
  }
}

async function recordEvents(logger, tries, disputeManager, fromBlock, toBlock, intent = 1) {
  try {
    const events = await disputeManager.getPastEvents('NewDispute', { fromBlock, toBlock })
    for(const event of events) {
      logger.success(`Received NewDispute event at tx ${event.transactionHash}`)
      await Settlement.create({ disputeId: event.args.disputeId.toString(), blockNumber: event.blockNumber.toString(), settled: false, tries: 0 })
    }
  } catch (error) {
    logger.error(`Error while trying to listening to all past NewDispute events from block ${fromBlock} to block ${toBlock}`)
    console.error(error)
    if (intent === tries) throw error
    await sleep(SECONDS_BETWEEN_INTENTS)
    await recordEvents(logger, tries, disputeManager, fromBlock, toBlock, intent + 1)
  }
}
