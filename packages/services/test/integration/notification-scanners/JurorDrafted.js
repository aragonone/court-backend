import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
const { expect } = chai
chai.use(sinonChai)

import { userDbCleanup, userNotificationTypeDbCleanup } from '../../helpers/dbCleanup'
import userNotificationTypeByModel from '../../helpers/userNotificationTypeByModel'
import { tryRunScanner } from '../../../src/workers/notification-scanner'
import { User } from '@aragonone/court-backend-server/build/models/objection'
import Network from '@aragonone/court-backend-server/build/web3/Network'

const { env: { CLIENT_URL } } = process
const notificationTypeModel = 'JurorDrafted'
const TEST_ADDR = '0xfc3771B19123F1f0237C737e92645BA6d628e2cB'
const TEST_EMAIL = 'notifications@service.test'
const TEST_ROUND_ID = '1020847100762815390390123822295304634368'
const TEST_DISPUTE_ID = '3'

describe('JurorDrafted notifications', () => {

  after(async () => {
    await userDbCleanup(TEST_ADDR, TEST_EMAIL)
    await userNotificationTypeDbCleanup(notificationTypeModel)
  })

  let logger = {}
  beforeEach(async () => {
    logger = {
      success: sinon.fake(),
      warn: sinon.fake(),
    }
  })
  
  it('should create a notification for drafted juror', async () => {
    await User.query().insertGraph({
      address: TEST_ADDR,
      addressVerified: true,
      emailVerified: true,
      email: {
        email: TEST_EMAIL
      }
    })
    Network.query = () => ({
      "adjudicationRounds": [
        {
          "dispute": {
            "id":TEST_DISPUTE_ID
          },
          "id": TEST_ROUND_ID,
          "jurors": [
            {
              "juror": {
                "id": TEST_ADDR
              }
            },
          ]
        }
      ]
    })
    await tryRunScanner(logger, notificationTypeModel)
    const type = await userNotificationTypeByModel(notificationTypeModel)
    expect(type.notifications.length).to.equal(1)
    expect(type.notifications[0].details).to.deep.equal({
      emailTemplateModel: {
        disputeId: TEST_DISPUTE_ID,
        disputeUrl: `${CLIENT_URL}disputes/${TEST_DISPUTE_ID}`
      },
      adjudicationRoundId: TEST_ROUND_ID
    })
    expect(logger.success).to.have.callCount(1)
  })

})
