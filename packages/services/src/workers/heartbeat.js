import sleep from '@aragon/court-backend-shared/helpers/sleep'
import Network from '@aragon/court-backend-server/build/web3/Network'

const SECONDS_BETWEEN_INTENTS = 3
const MAX_TRANSITIONS_PER_CALL = 20

export default async function (worker, job, logger) {
  try {
    const court = await Network.getCourt()
    await heartbeat(logger, court)
  } catch (error) {
    console.error({ context: `Worker '${worker}' job #${job}`, message: error.message, stack: error.stack })
    throw error
  }
}

async function heartbeat(logger, court, attempt = 1) {
  try {
    logger.info(`Transitioning up-to ${MAX_TRANSITIONS_PER_CALL} terms, try #${attempt}`)
    const transitions = await court.heartbeat(MAX_TRANSITIONS_PER_CALL)
    logger.success(`Transitioned ${transitions} Court terms`)
  } catch (error) {
    logger.error('Failed to transition terms with error')
    console.error(error)
    await sleep(SECONDS_BETWEEN_INTENTS)
    await heartbeat(logger, court, attempt + 1)
  }
}
