import { Op } from 'sequelize'
import Models from '@aragon/court-backend-server/build/models'
import Network from '@aragon/court-backend-server/build/web3/Network'

const { Reveal } = Models

export default async function (worker, job, tries, logger) {
  try {
    const reveals = await Reveal.findAll({ where: { revealed: false, tries: { [Op.lt]: tries } }, order: [['createdAt', 'DESC']] })
    logger.info(`${reveals.length} reveals pending`)
    const court = await Network.getCourt()
    for (const instance of reveals) await reveal(worker, job, logger, court, instance)
  } catch (error) {
    console.error({ context: `Worker '${worker}' job #${job}`, message: error.message, stack: error.stack })
    throw error
  }
}

async function reveal(worker, job, logger, court, reveal) {
  const { voteId, juror, outcome, salt, tries } = reveal
  try {
    logger.info(`Revealing vote #${voteId} for juror ${juror}, try #${tries + 1}`)
    await court.revealFor(voteId, juror, outcome, salt)
    await reveal.update({ tries: tries + 1, revealed: true })
    logger.success(`Revealed vote #${voteId} for juror ${juror}`)
  } catch (error) {
    logger.error(`Failed to reveal vote #${voteId} for juror ${juror}`)
    //console.error(error)
    console.error({ context: `Worker '${worker}' job #${job} revealing vote ID ${voteId} for juror ${juror}`, message: error.message, stack: error.stack })
    await reveal.update({ tries: tries + 1 })
  }
}
