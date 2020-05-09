import queries from '../helpers/notification-queries'
import Network from '@aragonone/court-backend-server/build/web3/Network'
import { UserNotification, UserNotificationType } from '@aragonone/court-backend-server/build/models/objection'
/*
const MINUTES = 60 * 1000
const HOURS = 60 * MINUTES
const NOTIFICATION_REPEAT = HOURS * 1
*/
export default async function (logger) {
  const notificationTypes = await UserNotification().query().whereNull('sentAt')
  for (const notificationType of notificationTypes) {
    await scanNotification(logger, notificationType)
  }
}

async function scanNotification(logger, notificationType) {

  // need a way to retrieve new notifications to be inserted into table
  // there has to be some notification <- type mapping library
  // notifications should contain userId, userNotificationTypeId and details to be found/inserted
  const { notifications } = await UserNotificationType.getstuff()

  for (notification of notifications) {
    await UserNotification.findOrInsert(notification)
  }

  /*
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
  */
}
