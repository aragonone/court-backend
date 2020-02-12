import Network from '@aragon/court-backend-server/build/web3/Network'

import query from '../helpers/graphql'

const ruledQuery = `
{
  disputes(where: {state: Ruled, settledPenalties: false}, orderBy: createdAt) {
    id
  }
}`

const endedQuery = `
{
  disputes(where: {state: Adjudicating}, orderBy: createdAt) {
    id
    lastRoundId
    rounds(where: {state: Ended}, orderBy: id, orderDirection: desc) {
      id
    }
  }
}
`

const appealingQuery = `
{
  disputes(where: {state: Adjudicating}, orderBy: createdAt) {
    id
    lastRoundId
    rounds(where: {stateInt_in: [3, 4]}, orderBy: id, orderDirection: desc) {
      id
    }
  }
}
`

const queries = [
  {
    title: 'Disputes in Ruled state',
    query: ruledQuery,
    checkCanSettle: false,
    executeRuling: false
  },
  {
    title: 'Disputes in Adjudicating state with last round ended',
    query: endedQuery,
    checkCanSettle: false,
    executeRuling: true
  },
  {
    title: 'Disputes in Adjudicating state with last round appealing',
    query: appealingQuery,
    checkCanSettle: true,
    executeRuling: true
  },
]

export default async function (worker, job, logger) {
  try {
    const court = await Network.getCourt()
    await Promise.all(queries.map(
      disputesQuery => settleDisputes(worker, job, logger, court, disputesQuery)
    ))
  } catch (error) {
    console.error({ context: `Worker '${worker}' job #${job}`, message: error.message, stack: error.stack })
    throw error
  }
}

async function settleDisputes(worker, job, logger, court, disputesQuery) {
  const { disputes } = await query(disputesQuery.query)
  logger.info(`${disputes.length} ${disputesQuery.title} pending`)
  await Promise.all(disputes.map(
    dispute => settle(worker, job, logger, court, dispute.id, disputesQuery.checkCanSettle, disputesQuery.executeRuling)
  ))
}

async function settle(worker, job, logger, court, disputeId, checkCanSettle, executeRuling) {
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
    logger.error(`Failed to settle dispute #${disputeId}`)
    console.error({ context: `Worker '${worker}' job #${job} settling dispute #${disputeId}`, message: error.message, stack: error.stack })
  }
}
