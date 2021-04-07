import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
const { expect } = chai
chai.use(sinonChai)

import { userDbCleanup, userNotificationTypeDbCleanup } from '../../helpers/dbCleanup'
import userNotificationTypeByModel from '../../helpers/userNotificationTypeByModel'
import { tryRunScanner } from '../../../src/workers/notification-scanner'
import { User } from '@1hive/celeste-backend-server/build/models/objection'
import Network from '@1hive/celeste-backend-server/build/web3/Network'
import * as termIdGetter from '../../../src/helpers/term-id-getter'

const { env: { CLIENT_URL } } = process
const notificationTypeModel = 'DueTasks'
const TEST_ADDR = '0xfc3771B19123F1f0237C737e92645BA6d628e2cB'
const TEST_EMAIL = 'notifications@service.test'
const TEST_DISPUTE_ID = '3'
const TEST_DRAFT_TERM_ID = '10'

describe('DueTasks notifications', () => {

  after(async () => {
    await userDbCleanup(TEST_ADDR, TEST_EMAIL)
    await userNotificationTypeDbCleanup(notificationTypeModel)
  })

  let ctx = {}
  beforeEach(async () => {
    ctx = {
      logger: {
        success: sinon.fake(),
        warn: sinon.fake(),
      },
      metrics: {
        notificationScanned: sinon.fake(),
        notificationSent: sinon.fake(),
      }
    }
    termIdGetter.draftTermIdFor = () => 1
    termIdGetter.dueDateFor = (draftTermId, type) => type == 'commit' ? 1591123146 : 1591126746
  })

  it('should create a notification with commit and reveal due tasks', async () => {
    await User.query().insertGraph({
      address: TEST_ADDR,
      addressVerified: true,
      emailVerified: true,
      email: {
        email: TEST_EMAIL
      }
    })
    Network.query = () => ({
      "committingRounds": [
        {
          "draftedTermId": TEST_DRAFT_TERM_ID,
          "dispute": {
            "id": TEST_DISPUTE_ID
          },
          "jurors": [
            {
              "juror": {
                "id": TEST_ADDR
              }
            }
          ]
        },
      ],
      "revealingRounds": [
        {
          "draftedTermId": TEST_DRAFT_TERM_ID,
          "dispute": {
            "id": TEST_DISPUTE_ID
          },
          "jurors": [
            {
              "juror": {
                "id": TEST_ADDR
              }
            }
          ]
        },
      ]
    })
    await tryRunScanner(ctx, notificationTypeModel)
    const type = await userNotificationTypeByModel(notificationTypeModel)
    expect(type.notifications.length).to.equal(1)
    expect(type.notifications[0].details).to.deep.equal({
      emailTemplateModel: {
        tasks: [
          {
            name: 'Commit vote',
            disputeId: TEST_DISPUTE_ID,
            disputeUrl: `${CLIENT_URL}#/disputes/${TEST_DISPUTE_ID}`,
            dueDate: `Tuesday, June 2, 2020, 6:39pm UTC`,
          },
          {
            name: 'Reveal vote',
            disputeId: TEST_DISPUTE_ID,
            disputeUrl: `${CLIENT_URL}#/disputes/${TEST_DISPUTE_ID}`,
            dueDate: `Tuesday, June 2, 2020, 7:39pm UTC`,
          },
        ],
      },
    })
    expect(ctx.logger.success).to.have.callCount(1)
  })

})
