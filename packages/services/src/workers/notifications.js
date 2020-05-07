import queries from '../helpers/notification-queries'
import Network from '@aragonone/court-backend-server/build/web3/Network'
import { User } from '@aragonone/court-backend-server/build/models/objection'
import emailClient from '@aragonone/court-backend-shared/helpers/email-client'

const MINUTES = 60 * 1000
const HOURS = 60 * MINUTES
const NOTIFICATION_REPEAT = HOURS * 1

export default async function (logger) {
  //const court = await Network.getCourt()

  for (const notificationQuery of queries) {
    //await checkNotification(logger, court, notificationQuery)
  }
}

async function checkNotification(logger, court, notificationQuery) {
  const { type } = notificationQuery
  // get a list of affected addresses?
  const { addresses } = await Network.query(notificationQuery.query)

  for (const address of addresses) {
    const user = await User.query().findOne({address}).withGraphFetched('[email, notificationSetting]')
    if (user?.addressVerified && user?.emailVerified && !user?.notificationSetting?.notificationsDisabled) {
      const notificationSent = !!await user.$relatedQuery('notifications')
        .where({type})
        .andWhere('sentAt', '<', new Date(Date.now()-NOTIFICATION_REPEAT))
        .first()
      if (!notificationSent) {
        sendNotification(Logger, user, notificationQuery)
      }
    }
  }
}

async function sendNotification(logger, user, notificationQuery) {
  const { type } = notificationQuery
  const message = {
    To: user.email.email,
    TemplateAlias: `court-notification-${notificationQuery.type}`,
    TemplateModel: { },
  }
  await emailClient.sendEmailWithTemplate(message)
  await user.$relatedUpdateOrInsert('notifications', {
    type,
    sentAt: new Date()
  })
  logger.success(`Notification ${type} sent for user ${user.address}`)
}
