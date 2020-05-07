import queries from '../helpers/notification-queries'
import Network from '@aragonone/court-backend-server/build/web3/Network'
import { User } from '@aragonone/court-backend-server/build/models/objection'
import emailClient from '@aragonone/court-backend-shared/helpers/email-client'

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
      const notificationSent = !!await user.$relatedQuery('notifications').findOne({type})
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
  await user.$relatedQuery('notifications').insert({type})
  logger.success(`Notification ${type} sent for user ${user.address}`)
}
