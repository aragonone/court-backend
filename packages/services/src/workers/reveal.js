import { Reveal } from '@aragonone/court-backend-server/build/models/objection'
import Network from '@aragonone/court-backend-server/build/web3/Network'

export default async function (logger) {
  const reveals = await Reveal.query().where({ revealed: false }).orderBy('createdAt', 'DESC')
  logger.info(`${reveals.length} reveals pending`)

  const court = await Network.getCourt()
  for (const instance of reveals) await reveal(logger, court, instance)
}

async function reveal(logger, court, reveal) {
  const { voteId, juror, outcome, salt } = reveal
  try {
    logger.info(`Revealing vote #${voteId} for juror ${juror}`)
    await court.revealFor(voteId, juror, outcome, salt)
    await reveal.$query().update({ revealed: true })
    logger.success(`Revealed vote #${voteId} for juror ${juror}`)
  } catch (error) {
    logger.error(`Failed to reveal vote #${voteId} for juror ${juror}`, error)
  }
}
