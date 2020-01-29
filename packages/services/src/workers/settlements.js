import { Op } from 'sequelize'
import Models from '@aragon/court-backend-server/build/models'
import Network from '@aragon/court-backend-server/build/web3/Network'

const { Settlement } = Models

export default async function (worker, job, tries, logger) {
  try {
    const settlements = await Settlement.findAll({ where: { settled: false, tries: { [Op.lt]: tries } }, order: [['createdAt', 'DESC']] })
    logger.info(`${settlements.length} settlements pending`)
    const court = await Network.getCourt()
    for (const settlement of settlements) await settle(worker, job, logger, court, settlement)
  } catch (error) {
    console.error({ context: `Worker '${worker}' job #${job}`, message: error.message, stack: error.stack })
    throw error
  }
}

async function settle(worker, job, logger, court, settlement) {
  const { disputeId, tries } = settlement
  try {
    const canSettle = await court.canSettle(disputeId)
    if (!canSettle) return logger.warn(`Ignoring dispute #${disputeId}, it cannot be settled now`)

    logger.info(`Settling dispute #${disputeId}, try #${tries + 1}`)
    await court.settle(disputeId)
    await settlement.update({ tries: tries + 1, settled: true })
    logger.success(`Settled dispute #${disputeId}`)
  } catch (error) {
    logger.error(`Failed to settle dispute #${disputeId}`)
    //console.error(error)
    console.error({ context: `Worker '${worker}' job #${job} settling dispute #${disputeId}`, message: error.message, stack: error.stack })
    await settlement.update({ tries: tries + 1 })
  }
}
