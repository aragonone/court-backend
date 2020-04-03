import queries from '../helpers/settlement-queries'
import Network from '@aragonone/court-backend-server/build/web3/Network'

export default async function (logger) {
  const court = await Network.getCourt()

  for (const disputesQuery of queries) {
    await settleDisputes(logger, court, disputesQuery)
  }
}

async function settleDisputes(logger, court, disputesQuery) {
  const { disputes } = await Network.query(disputesQuery.query)
  logger.info(`${disputes.length} ${disputesQuery.title} pending`)

  for (const dispute of disputes) {
    await settle(logger, court, dispute.id, disputesQuery)
  }
}

async function settle(logger, court, disputeId, { checkCanSettle, executeRuling }) {
  try {
    if (checkCanSettle) {
      const canSettle = await court.canSettle(disputeId)
      if (!canSettle) return logger.warn(`Ignoring dispute #${disputeId}, it cannot be settled now`)
    }

    if (executeRuling) {
      logger.info(`Executing ruling for dispute #${disputeId}`)
      await court.execute(disputeId)
      logger.success(`Executed ruling for dispute #${disputeId}`)
    }

    logger.info(`Settling dispute #${disputeId}`)
    await court.settle(disputeId)
    logger.success(`Settled dispute #${disputeId}`)
  } catch (error) {
    logger.error(`Failed to settle dispute #${disputeId}`, error)
  }
}
