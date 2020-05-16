import { User, UserNotification, UserNotificationType } from '@aragonone/court-backend-server/build/models/objection'
import * as notificationScanners from '../models/notification-scanners'

/**
 * This worker loops over all notification scanner objects and 
 * inserts a notification DB entry for every email that should be sent
 */
export default async function (logger) {
  const models = Object.keys(notificationScanners)
  for (const model of models) {
    await tryRunScanner(logger, model)
  }
}

export async function tryRunScanner(logger, model) {
  const scanner = notificationScanners[model]
  if (!scanner) throw `Notification scanner ${model} not found.`
  const type = await UserNotificationType.findOrInsert({model})
  if (!shouldScanNow(type, scanner)) return
  const notifications = await scanner.scan()
  for (const notification of notifications) {
    const { address, details } = notification
    const user = await User.findOne({address})
    if (!await scanner.shouldNotifyUser(user)) continue
    await UserNotification.findOrInsert({
      userId: user.id,
      userNotificationTypeId: type.id,
      details
    })
  }
  await type.$query().update({ scannedAt: new Date() })
  logger.success(`Notification type ${model} scanned.`)
}

function shouldScanNow(type, scanner) {
  const { scannedAt } = type
  const { scanPeriod } = scanner
  return !scannedAt || scannedAt.getTime()+scanPeriod <= Date.now()
}
