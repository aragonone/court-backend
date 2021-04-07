const logger = require('@1hive/celeste-backend-shared/helpers/logger')('activate')

const command = 'activate'
const describe = 'Activate ANJ to the Court'

const builder = {
  amount: { alias: 'a', describe: 'Number of ANJ tokens to activate', type: 'string', demand: true },
  juror: { alias: 'j', describe: 'Optional address of the juror activating the tokens for. If missing tokens will be activated for the sender.', type: 'string' },
}

const handlerAsync = async (environment, { from, juror, amount }) => {
  const court = await environment.getCourt()

  if (!juror || juror === from) {
    await court.activate(amount)
    logger.success(`Activated ANJ ${amount}`)
  }
  else {
    await court.activateFor(juror, amount)
    logger.success(`Activated ANJ ${amount} for ${juror}`)
  }
}

module.exports = {
  command,
  describe,
  builder,
  handlerAsync
}
