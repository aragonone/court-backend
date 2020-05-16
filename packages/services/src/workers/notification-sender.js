import emailClient from '@aragonone/court-backend-shared/helpers/email-client'
import { UserNotification } from '@aragonone/court-backend-server/build/models/objection'
import * as notificationScanners from '../models/notification-scanners'

/**
 * This worker loops over all unprocessed notification DB entries
 * and sends an associated email
 */
export default async function (logger) {
  const notifications = await UserNotification.query().whereNull('sentAt')
  for (const notification of notifications) {
    await trySendNotification(logger, notification)
  }
}

export async function trySendNotification(logger, notification) {
  if (notification.sentAt != null) return
  notification = await notification.$fetchGraph('[user.email, type]')
  const { user, type: { model } } = notification
  const scanner = notificationScanners[model]
  if (!scanner) throw `Notification scanner ${model} not found.`
  if (!await scanner.checkUser(user)) {
    logger.warn(`Deleting stale notification type ${model} for user ${user.address}`)
    await notification.$query().del()
    return
  }
  const message = {
    To: user.email.email,
    TemplateAlias: scanner.emailTemplateAlias,
    TemplateModel: notification.details.emailTemplateModel ?? {},
  }
  await emailClient.sendEmailWithTemplate(message)
  await notification.$query().update({sentAt: new Date()})
  logger.success(`Notification type ${model} sent for user ${user.address}`)
}
