import sleep from '@aragon/court-backend-shared/helpers/sleep'
import Network from '@aragon/court-backend-server/build/web3/Network'

const SECONDS_BETWEEN_INTENTS = 3
const ERROR_COURT_NOT_UP_TO_DATE = 'CLK_TERM_DOES_NOT_EXIST'

// first period to ensure
let initialPeriodId = 0

export default async function (worker, job, logger) {
  try {
    const court = await Network.getCourt()
    await ensurePeriodBalanceDetails(logger, court)
  } catch (error) {
    console.error({ context: `Worker '${worker}' job #${job}`, message: error.message, stack: error.stack })
    throw error
  }
}

async function ensurePeriodBalanceDetails(logger, court, attempt = 1) {
  try {
    const subscriptions = await court.subscriptions()
    const currentPeriodId = (await subscriptions.getCurrentPeriodId()).toNumber()
    console.log(currentPeriodId)
    logger.info(`Periods to ensure: ${initialPeriodId} - ${currentPeriodId}`)
    for (let periodId = initialPeriodId; periodId <= currentPeriodId; periodId++) {
      logger.info(`Ensuring balance details for period ${periodId}, try #${attempt}`)

      await subscriptions.ensurePeriodBalanceDetails(periodId)

      initialPeriodId = periodId + 1
      logger.success(`Ensured balance details for period ${periodId}`)
    }
  } catch (error) {
    if (error.reason === ERROR_COURT_NOT_UP_TO_DATE) {
      logger.error(`Error: Court terms are not up to date. Run heartbeat first.`)
    } else {
      logger.error('Failed ensure balance period details with error')
      console(error)
    }
    await sleep(SECONDS_BETWEEN_INTENTS)
    await ensurePeriodBalanceDetails(logger, court, attempt + 1)
  }
}
