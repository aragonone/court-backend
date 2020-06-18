import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
const { expect } = chai
chai.use(sinonChai)

import { userDbCleanup, userNotificationTypeDbCleanup } from '../../helpers/dbCleanup'
import userNotificationTypeByModel from '../../helpers/userNotificationTypeByModel'
import { tryRunScanner } from '../../../src/workers/notification-scanner'
import { trySendNotification } from '../../../src/workers/notification-sender'
import { User, UserEmail, UserNotification } from '@aragonone/court-backend-server/build/models/objection'

const { env: { CLIENT_URL } } = process
const notificationTypeModel = 'SubscriptionReminder'
const TEST_ADDR = '0xfc3771B19123F1f0237C737e92645BA6d628e2cB'
const TEST_EMAIL = 'subscription@reminder.test'
import { DAYS } from '@aragonone/court-backend-shared/helpers/times'


describe('SubscriptionReminder notifications', () => {

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
  })

  it('should not create a notification for a user with verified address (opted out)', async () => {
    await userDbCleanup(TEST_ADDR, TEST_EMAIL)
    await userNotificationTypeDbCleanup(notificationTypeModel)
    await User.query().insertGraph({
      address: TEST_ADDR,
      addressVerified: true,
      emailVerified: false,
      email: {
        email: TEST_EMAIL
      }
    })
    await tryRunScanner(ctx, notificationTypeModel)
    const type = await userNotificationTypeByModel(notificationTypeModel)
    expect(type.notifications.length).to.equal(0)
    expect(ctx.logger.success).to.have.callCount(1)
  })

  it('should not create a notification for a user with a recent verification token', async () => {
    await userDbCleanup(TEST_ADDR, TEST_EMAIL)
    await userNotificationTypeDbCleanup(notificationTypeModel)
    await User.query().insertGraph({
      address: TEST_ADDR,
      addressVerified: true,
      emailVerified: false,
      email: {
        email: TEST_EMAIL
      },
      emailVerificationToken: {
        token: 'test',
        email: TEST_EMAIL,
        expiresAt: new Date()
      }
    })
    await tryRunScanner(ctx, notificationTypeModel)
    const type = await userNotificationTypeByModel(notificationTypeModel)
    expect(type.notifications.length).to.equal(0)
    expect(ctx.logger.success).to.have.callCount(1)
  })

  it('should create a notification for a user with a day old verification token', async () => {
    await userDbCleanup(TEST_ADDR, TEST_EMAIL)
    await userNotificationTypeDbCleanup(notificationTypeModel)
    const user = await User.query().insertGraph({
      address: TEST_ADDR,
      addressVerified: true,
      emailVerified: false,
      email: {
        email: TEST_EMAIL
      },
      emailVerificationToken: {
        token: 'test',
        email: TEST_EMAIL,
        expiresAt: new Date(Date.now()-DAYS)
      }
    })
    await tryRunScanner(ctx, notificationTypeModel)
    const type = await userNotificationTypeByModel(notificationTypeModel)
    expect(type.notifications.length).to.equal(1)
    expect(type.notifications[0].details).to.deep.equal({
      emailTemplateModel: {
        emailPreferencesUrl: CLIENT_URL
      },
      token: user.emailVerificationToken.id
    })
    expect(ctx.logger.success).to.have.callCount(1)
  })

  it('should not run scan again before scan period', async () => {
    await tryRunScanner(ctx, notificationTypeModel)
    expect(ctx.logger.success).to.have.callCount(0)
  })

  it('should not change existing notifications on second scan', async () => {
    const type = await userNotificationTypeByModel(notificationTypeModel)
    await type.$query().update({scannedAt: null})
    await tryRunScanner(ctx, notificationTypeModel)
    const newType = await userNotificationTypeByModel(notificationTypeModel)
    expect(type.notifications).to.deep.equal(newType.notifications)
  })

  it('should send single notification', async () => {
    const currentDate = new Date()
    const type = await userNotificationTypeByModel(notificationTypeModel)
    const notification = type.notifications[0]
    await trySendNotification(ctx, notification)
    const newNotification = await UserNotification.query().findById(notification.id)
    expect(newNotification.sentAt).to.be.at.least(currentDate)
    expect(ctx.logger.success).to.have.callCount(1)
  })

  it('should not send same notification twice', async () => {
    const type = await userNotificationTypeByModel(notificationTypeModel)
    const notification = type.notifications[0]
    await trySendNotification(ctx, notification)
    expect(ctx.logger.success).to.have.callCount(0)
  })

  it('should delete stale notification with no user email', async () => {
    const type = await userNotificationTypeByModel(notificationTypeModel)
    const notification = type.notifications[0]
    await notification.$query().update({sentAt: null})
    await UserEmail.query().where({email: TEST_EMAIL}).del()
    await trySendNotification(ctx, notification)
    const newType = await userNotificationTypeByModel(notificationTypeModel)
    expect(newType.notifications.length).to.equal(0)
    expect(ctx.logger.warn).to.have.callCount(1)
  })

})
