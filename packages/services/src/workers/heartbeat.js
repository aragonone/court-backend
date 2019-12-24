import sleep from '@aragon/court-backend-shared/helpers/sleep'
import Models from '@aragon/court-backend-server/build/models'
import Network from '@aragon/court-backend-server/build/web3/Network'

const SECONDS_BETWEEN_INTENTS = 3
const MAX_TRANSITIONS_PER_CALL = 2

export default async function (worker, job, tries, logger) {
  try {
    await heartbeat(logger, tries)
  } catch (error) {
    const { ErrorLogs } = Models
    await ErrorLogs.create({ context: `Worker '${worker}' job #${job}`, message: error.message, stack: error.stack })
    throw error
  }
}

async function heartbeat(logger, tries, intent = 1) {
  try {
    logger.success(`Requesting the Court to transition up-to ${MAX_TRANSITIONS_PER_CALL} terms, try #${intent}`)
    const court = await Network.getCourt()
    const transitions = await court.heartbeat(MAX_TRANSITIONS_PER_CALL)
    logger.success(`Transitioned ${transitions} Court terms`)
  } catch (error) {
    logger.error('Failed to transition terms with error')
    console.error(error)
    if (intent === tries) throw error
    await sleep(SECONDS_BETWEEN_INTENTS)
    await heartbeat(logger, tries, intent + 1)
  }
}
