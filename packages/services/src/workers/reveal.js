import { Reveal } from '@aragonone/celeste-backend-server/build/models/objection'
import Network from '@aragonone/celeste-backend-server/build/web3/Network'

const REVEAL_TRIES = 3

export default async function (ctx) {
  const { logger } = ctx
  const reveals = await Reveal.query()
    .where({ revealed: false })
    .where({ expired: false })
    .where('failedAttempts', '<', REVEAL_TRIES)
    .orderBy('createdAt', 'DESC')

  logger.info(`${reveals.length} reveals pending`)
  const court = await Network.getCourt()
  for (const instance of reveals) await reveal(logger, court, instance)
}

async function reveal(logger, court, reveal) {
  const { voteId, juror, outcome, salt, failedAttempts } = reveal
  try {
    logger.info(`Revealing vote #${voteId} for juror ${juror}`)
    const { disputeId, roundNumber } = reveal
    const { canReveal, expired } = await court.getRevealStatus(disputeId, roundNumber)

    if (expired) {
      await reveal.$query().update({ expired: true })
      return logger.error(`Reveal vote #${voteId} for juror ${juror} has expired!`)
    } else if (!canReveal) {
      return logger.warn(`Cannot reveal round #${roundNumber} for dispute #${disputeId} yet`)
    }

    await court.revealFor(voteId, juror, outcome, salt)
    const actualOutcome = await court.getOutcome(voteId, juror)
    if (actualOutcome.toString() !== outcome.toString()) throw Error(`Expected outcome ${outcome}, got ${actualOutcome.toString()}`)
    await reveal.$query().update({ revealed: true })
    logger.success(`Revealed vote #${voteId} for juror ${juror}`)
  } catch (error) {
    await reveal.$query().update({ failedAttempts: failedAttempts + 1 })
    logger.error(`Failed to reveal vote #${voteId} for juror ${juror}`, error)
  }
}
