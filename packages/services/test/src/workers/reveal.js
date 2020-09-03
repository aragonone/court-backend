import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import revealWorker from '../../../src/workers/reveal'
import Network from '@aragonone/court-backend-server/build/web3/Network'
import { Reveal } from '@aragonone/court-backend-server/build/models/objection'

const { expect } = chai
chai.use(sinonChai)

const REVEALS_MOCK_DATA = [
  { juror: '0xfc3771B19123F1f0237C737e92645BA6d628e2cB', salt: 'password', outcome: '3', voteId: '5444517870735015415413993718908291383296', disputeId: '15', roundNumber: '0' },
  { juror: '0xd5ad815503d459faf1674c72bfcc53f2cf48358c', salt: 'password', outcome: '2', voteId: '5444517870735015415413993718908291383296', disputeId: '15', roundNumber: '0' },
  { juror: '0x61f73dfc8561c322171c774e5be0d9ae21b2da42', salt: 'password', outcome: '4', voteId: '5444517870735015415413993718908291383296', disputeId: '14', roundNumber: '1' },
]

describe('Reveals worker', () => {
  let ctx

  beforeEach('mock logger', async () => {
    ctx = { logger: { info: sinon.fake(), success: sinon.fake(), warn: sinon.fake(), error: sinon.fake() } }
  })

  afterEach('drop reveals', async () => {
    await Reveal.query().del()
  })

  context('when there are no reveals', () => {
    it('does not try to reveal anything', async () => {
      await revealWorker(ctx)

      expect(ctx.logger.warn).to.have.callCount(0)
      expect(ctx.logger.error).to.have.callCount(0)
      expect(ctx.logger.success).to.have.callCount(0)
    })
  })

  context('when there is one reveal', () => {
    let reveal

    beforeEach('create reveal', async () => {
      reveal = await Reveal.create(REVEALS_MOCK_DATA[0])
    })

    context('when the reveal is not expired', () => {
      context('when it can be revealed', () => {
        context('when the reveal does not fail', () => {
          beforeEach('mock court and reveal', async () => {
            Network.getCourt = () => ({
              getRevealStatus: () => ({ canReveal: true, expired: false }),
              revealFor: () => true,
              getOutcome: () => reveal.outcome
            })

            await revealWorker(ctx)
          })

          it('marks the reveal as revealed', async () => {
            reveal = await Reveal.findById(reveal.id)
            expect(reveal.expired).to.eq(false)
            expect(reveal.revealed).to.eq(true)
            expect(reveal.failedAttempts).to.eq(0)

            expect(ctx.logger.warn).to.have.callCount(0)
            expect(ctx.logger.error).to.have.callCount(0)
            expect(ctx.logger.success).to.have.callCount(1)
          })

          it('does not try to reveal it again', async () => {
            ctx.logger.success.resetHistory()
            await revealWorker(ctx)

            expect(ctx.logger.warn).to.have.callCount(0)
            expect(ctx.logger.error).to.have.callCount(0)
            expect(ctx.logger.success).to.have.callCount(0)
          })
        })

        context('when the reveal fails once', () => {
          beforeEach('mock court and reveal', async () => {
            const Court = {
              getRevealStatus: () => ({ canReveal: true, expired: false }),
              revealFor: function () {
                if (Court.revealFailed) return
                this.revealFailed = true
                throw 'error'
              },
              getOutcome: () => reveal.outcome,
            }

            Network.getCourt = () => Court
            await revealWorker(ctx)
          })

          it('marks the reveal as processing', async () => {
            reveal = await Reveal.findById(reveal.id)
            expect(reveal.expired).to.eq(false)
            expect(reveal.revealed).to.eq(false)
            expect(reveal.failedAttempts).to.eq(1)

            expect(ctx.logger.warn).to.have.callCount(0)
            expect(ctx.logger.error).to.have.callCount(1)
            expect(ctx.logger.success).to.have.callCount(0)
          })

          it('tries to reveal it again', async () => {
            ctx.logger.error.resetHistory()
            await revealWorker(ctx)

            reveal = await Reveal.findById(reveal.id)
            expect(reveal.expired).to.eq(false)
            expect(reveal.revealed).to.eq(true)
            expect(reveal.failedAttempts).to.eq(1)

            expect(ctx.logger.warn).to.have.callCount(0)
            expect(ctx.logger.error).to.have.callCount(0)
            expect(ctx.logger.success).to.have.callCount(1)
          })
        })

        context('when the reveal fails three times', () => {
          beforeEach('mock court and reveal', async () => {
            Network.getCourt = () => ({
              getRevealStatus: () => ({ canReveal: true, expired: false }),
              revealFor: () => { throw 'error' }
            })
            await revealWorker(ctx)
            await revealWorker(ctx)
            await revealWorker(ctx)
          })

          it('marks the reveal as failed', async () => {
            reveal = await Reveal.findById(reveal.id)
            expect(reveal.expired).to.eq(false)
            expect(reveal.revealed).to.eq(false)
            expect(reveal.failedAttempts).to.eq(3)

            expect(ctx.logger.warn).to.have.callCount(0)
            expect(ctx.logger.error).to.have.callCount(3)
            expect(ctx.logger.success).to.have.callCount(0)
          })

          it('does not try to reveal it again', async () => {
            ctx.logger.error.resetHistory()
            await revealWorker(ctx)

            reveal = await Reveal.findById(reveal.id)
            expect(reveal.expired).to.eq(false)
            expect(reveal.revealed).to.eq(false)
            expect(reveal.failedAttempts).to.eq(3)

            expect(ctx.logger.warn).to.have.callCount(0)
            expect(ctx.logger.error).to.have.callCount(0)
            expect(ctx.logger.success).to.have.callCount(0)
          })
        })
      })

      context('when it cannot be revealed', () => {
        beforeEach('mock court and reveal', async () => {
          const Court = {
            getRevealStatus: () => ({ canReveal: false, expired: false }),
          }

          Network.getCourt = () => Court
          await revealWorker(ctx)
        })

        it('ignores the reveal', async () => {
          reveal = await Reveal.findById(reveal.id)
          expect(reveal.expired).to.eq(false)
          expect(reveal.revealed).to.eq(false)
          expect(reveal.failedAttempts).to.eq(0)

          expect(ctx.logger.warn).to.have.callCount(1)
          expect(ctx.logger.error).to.have.callCount(0)
          expect(ctx.logger.success).to.have.callCount(0)
        })

        it('tries to reveal it again', async () => {
          ctx.logger.warn.resetHistory()
          await revealWorker(ctx)

          reveal = await Reveal.findById(reveal.id)
          expect(reveal.expired).to.eq(false)
          expect(reveal.revealed).to.eq(false)
          expect(reveal.failedAttempts).to.eq(0)

          expect(ctx.logger.warn).to.have.callCount(1)
          expect(ctx.logger.error).to.have.callCount(0)
          expect(ctx.logger.success).to.have.callCount(0)
        })
      })
    })

    context('when the reveal is expired', () => {
      beforeEach('mock court and reveal', async () => {
        const Court = {
          getRevealStatus: () => ({ canReveal: false, expired: true })
        }

        Network.getCourt = () => Court
        await revealWorker(ctx)
      })

      it('marks the reveal as expired', async () => {
        reveal = await Reveal.findById(reveal.id)
        expect(reveal.expired).to.eq(true)
        expect(reveal.revealed).to.eq(false)
        expect(reveal.failedAttempts).to.eq(0)

        expect(ctx.logger.warn).to.have.callCount(0)
        expect(ctx.logger.error).to.have.callCount(1)
        expect(ctx.logger.success).to.have.callCount(0)
      })

      it('does not try to reveal it again', async () => {
        ctx.logger.error.resetHistory()
        await revealWorker(ctx)

        reveal = await Reveal.findById(reveal.id)
        expect(reveal.expired).to.eq(true)
        expect(reveal.revealed).to.eq(false)
        expect(reveal.failedAttempts).to.eq(0)

        expect(ctx.logger.warn).to.have.callCount(0)
        expect(ctx.logger.error).to.have.callCount(0)
        expect(ctx.logger.success).to.have.callCount(0)
      })
    })
  })

  context('when there are many reveals', () => {
    let reveals = []

    beforeEach('create reveals', async () => {
      reveals = []
      for (const revealData of REVEALS_MOCK_DATA) {
        reveals.push(await Reveal.create(revealData))
      }
    })

    context('when all the reveals can be revealed', () => {
      beforeEach('mock court and reveal', async () => {
        Network.getCourt = () => {
          return ({
            getRevealStatus: () => ({ canReveal: true, expired: false }),
            revealFor: () => true,
            getOutcome: (voteId, juror) => REVEALS_MOCK_DATA.find(data => data.juror == juror).outcome
          })
        }

        await revealWorker(ctx)
      })

      it('reveals the requests that can be revealed', async () => {
        for (let reveal of reveals) {
          reveal = await Reveal.findById(reveal.id)
          expect(reveal.expired).to.eq(false)
          expect(reveal.revealed).to.eq(true)
          expect(reveal.failedAttempts).to.eq(0)
        }

        expect(ctx.logger.warn).to.have.callCount(0)
        expect(ctx.logger.error).to.have.callCount(0)
        expect(ctx.logger.success).to.have.callCount(reveals.length)
      })

      it('does not try to reveal them again', async () => {
        ctx.logger.success.resetHistory()
        await revealWorker(ctx)

        expect(ctx.logger.warn).to.have.callCount(0)
        expect(ctx.logger.error).to.have.callCount(0)
        expect(ctx.logger.success).to.have.callCount(0)
      })
    })

    context('when one of the reveals cannot be revealed yet', () => {
      const REVEALING_DISPUTE = '15'

      beforeEach('mock court and reveal', async () => {
        Network.getCourt = () => {
          return ({
            getRevealStatus: disputeId => ({ canReveal: disputeId == REVEALING_DISPUTE, expired: false }),
            revealFor: () => true,
            getOutcome: (voteId, juror) => REVEALS_MOCK_DATA.find(data => data.juror == juror).outcome
          })
        }

        await revealWorker(ctx)
      })

      it('reveals the requests that can be revealed', async () => {
        for (let reveal of reveals) {
          reveal = await Reveal.findById(reveal.id)
          expect(reveal.expired).to.eq(false)
          expect(reveal.revealed).to.eq(reveal.disputeId === REVEALING_DISPUTE)
          expect(reveal.failedAttempts).to.eq(0)
        }

        expect(ctx.logger.warn).to.have.callCount(1)
        expect(ctx.logger.error).to.have.callCount(0)
        expect(ctx.logger.success).to.have.callCount(reveals.length - 1)
      })

      it('tries revealing the pending reveal', async () => {
        ctx.logger.warn.resetHistory()
        ctx.logger.success.resetHistory()
        await revealWorker(ctx)

        for (let reveal of reveals) {
          reveal = await Reveal.findById(reveal.id)
          expect(reveal.expired).to.eq(false)
          expect(reveal.revealed).to.eq(reveal.disputeId === REVEALING_DISPUTE)
          expect(reveal.failedAttempts).to.eq(0)
        }

        expect(ctx.logger.warn).to.have.callCount(1)
        expect(ctx.logger.error).to.have.callCount(0)
        expect(ctx.logger.success).to.have.callCount(0)
      })
    })

    context('when one of the reveals is expired', () => {
      const EXPIRED_DISPUTE = '14'

      beforeEach('mock court and reveal', async () => {
        Network.getCourt = () => {
          return ({
            getRevealStatus: disputeId => ({ canReveal: disputeId !== EXPIRED_DISPUTE, expired: disputeId === EXPIRED_DISPUTE }),
            revealFor: () => true,
            getOutcome: (voteId, juror) => REVEALS_MOCK_DATA.find(data => data.juror == juror).outcome
          })
        }

        await revealWorker(ctx)
      })

      it('reveals the requests that can be revealed', async () => {
        for (let reveal of reveals) {
          reveal = await Reveal.findById(reveal.id)
          expect(reveal.expired).to.eq(reveal.disputeId === EXPIRED_DISPUTE)
          expect(reveal.revealed).to.eq(reveal.disputeId !== EXPIRED_DISPUTE)
          expect(reveal.failedAttempts).to.eq(0)
        }

        expect(ctx.logger.warn).to.have.callCount(0)
        expect(ctx.logger.error).to.have.callCount(1)
        expect(ctx.logger.success).to.have.callCount(reveals.length - 1)
      })

      it('does not try to reveal them again', async () => {
        ctx.logger.error.resetHistory()
        ctx.logger.success.resetHistory()
        await revealWorker(ctx)

        expect(ctx.logger.warn).to.have.callCount(0)
        expect(ctx.logger.error).to.have.callCount(0)
        expect(ctx.logger.success).to.have.callCount(0)
      })
    })
  })
})
