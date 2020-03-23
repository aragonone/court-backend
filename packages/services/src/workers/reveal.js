import Models from '@aragonone/court-backend-server/build/models'
import Network from '@aragonone/court-backend-server/build/web3/Network'

const { Reveal } = Models

export default async function (logger) {
  const reveals = await Reveal.findAll({ where: { revealed: false }, order: [['createdAt', 'DESC']] })
  logger.info(`${reveals.length} reveals pending`)

  const court = await Network.getCourt()
  for (const instance of reveals) await reveal(logger, court, instance)
}

async function reveal(worker, job, logger, court, reveal) {
  const { voteId, juror, outcome, salt } = reveal
  try {
    logger.info(`Revealing vote #${voteId} for juror ${juror}`)
    await court.revealFor(voteId, juror, outcome, salt)
    await reveal.update({ revealed: true })
    logger.success(`Revealed vote #${voteId} for juror ${juror}`)
  } catch (error) {
    logger.error(`Failed to reveal vote #${voteId} for juror ${juror}`, error)
  }
}
