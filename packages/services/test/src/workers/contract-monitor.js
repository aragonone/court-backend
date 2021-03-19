import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import worker from '../../../src/workers/contract-monitor'
import Etherscan from '../../../src/models/Etherscan'

const { expect } = chai
chai.use(sinonChai)

describe('Contract Monitor worker', () => {
  before(() => {
    Etherscan.prototype.getTransactionsFrom = async () => {
      const base = {
        to: '0xee4650cbe7a2b23701d416f58b41d8b76b617797',
        timeStamp: String(Date.now()/1000),
        isError: '1',
      }
      return [
        // reveal
        { ...base, input: '0x5f38b99c' },
        // settleReward
        { ...base, input: '0x82a8b3b0' },
        // settlePenalties
        { ...base, input: '0x859ba187' },
        // rule
        { ...base, input: '0x8bb04875' },
        // heartbeat
        { ...base, input: '0x9bf6fa57' },
        { ...base, input: '0x9bf6fa57' },
        { ...base, input: '0x9bf6fa57' },
        // obsolete heartbeat (should not count)
        { ...base, input: '0x9bf6fa57', timeStamp: '1599000000' },
      ]
    }
  })

  let ctx
  beforeEach(() => {
    ctx = {
      logger: {
        success: sinon.fake(),
      },
      metrics: {
        transactionErrors: sinon.fake(),
      }
    }
  })

  it('should render metrics for failed requests', async () => {
    await worker(ctx)
    const { logger, metrics: { transactionErrors } } = ctx
    expect(logger.success).to.have.callCount(1)
    expect(transactionErrors).to.have.callCount(5)
    expect(transactionErrors).to.have.been.calledWith('reveal', 1)
    expect(transactionErrors).to.have.been.calledWith('settleReward', 1)
    expect(transactionErrors).to.have.been.calledWith('settlePenalties', 1)
    expect(transactionErrors).to.have.been.calledWith('rule', 1)
    expect(transactionErrors).to.have.been.calledWith('heartbeat', 3)
  })
})
