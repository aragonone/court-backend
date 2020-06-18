import emailClient from '@aragonone/court-backend-shared/helpers/email-client'
import { UserNotification } from '@aragonone/court-backend-server/build/models/objection'
import * as notificationScanners from '../models/notification-scanners'
import { accountData } from '../../../../emails/helpers'

/**
 * This worker loops over all unprocessed notification DB entries
 * and sends an associated email
 */
export default async function (ctx) {
  const notifications = await UserNotification.findUnsent()
  for (const notification of notifications) {
    await trySendNotification(ctx, notification)
  }
}

export async function trySendNotification(ctx, notification) {
  const { logger, metrics } = ctx
  if (notification.sentAt != null) return
  notification = await notification.$fetchGraph('[user.email, type]')
  const { user, type: { model } } = notification
  const scanner = notificationScanners[model]
  if (!scanner) {
    logger.error(`Notification scanner ${model} not found.`)
    return
  }
  if (!await scanner.shouldNotifyUser(user)) {
    logger.warn(`Deleting stale notification type ${model} for user ${user.address}`)
    await notification.$query().del()
    return
  }
  let TemplateModel = notification.details.emailTemplateModel ?? {}
  TemplateModel = {
    ...TemplateModel,
    ...accountData(user.address),
    date: notification.createdAtDateString
  }
  const message = {
    To: user.email.email,
    TemplateAlias: scanner.emailTemplateAlias,
    TemplateModel,
  }
  try {
    await emailClient.sendEmailWithTemplate(message)
    await notification.$query().update({sentAt: new Date()})
    logger.success(`Notification type ${model} sent for user ${user.address}`)
    metrics.notificationSent(model)
  }
  catch (error) {
    metrics.workerError()
    logger.error(`Could not send notification type ${model} for user ${user.address}`, error)
  }
}
