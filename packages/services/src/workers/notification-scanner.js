import { User, UserNotification, UserNotificationType } from '@aragonone/court-backend-server/build/models/objection'
import * as notificationScanners from '../models/notification-scanners'

/**
 * This worker loops over all notification scanner objects and 
 * inserts a notification DB entry for every email that should be sent
 */
export default async function (logger) {
  Object.keys(notificationScanners).forEach(async (model) => {
    await tryRunScanner(logger, model)
  })
}

export async function tryRunScanner(logger, model) {
  const type = await UserNotificationType.findOrInsert({model})
  const scanner = notificationScanners[model]
  const { scannedAt } = type
  const { scanPeriod } = scanner
  if (scannedAt && scannedAt.getTime()+scanPeriod > Date.now()) return
  const notifications = await scanner.scan()
  for (const notification of notifications) {
    const { address, details } = notification
    const user = await User.query().findOne({address})
    if (!await scanner.checkUser(user)) continue
    await UserNotification.findOrInsert({
      userId: user.id,
      userNotificationTypeId: type.id,
      details
    })
  }
  await type.$query().update({ scannedAt: new Date() })
  logger.success(`Notification type ${model} scanned.`)
}
