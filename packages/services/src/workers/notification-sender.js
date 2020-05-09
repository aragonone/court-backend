import emailClient from '@aragonone/court-backend-shared/helpers/email-client'
import { UserNotification } from '@aragonone/court-backend-server/build/models/objection'

export default async function (logger) {
  const notifications = await UserNotification().query().whereNull('sentAt')
  for (const notification of notifications) {
    await sendNotification(logger, notification)
  }
}

export async function sendNotification(logger, notification) {
  notification = await notification.$fetchGraph('[user.email, type]')
  if (!notification.user.email) {
    return logger.warn(`Cannot send notification ${notification.id}, user ${notification.user.address} has no associated email`)
  }
  const message = {
    To: notification.user.email.email,
    // need to retrieve template from some notification type library
    // this can be mapped from notification type/details
    TemplateAlias: `court-notification-${notification.type.type}`,
    TemplateModel: { },
  }
  await emailClient.sendEmailWithTemplate(message)
  await notification.$query().update({'sentAt': Date.now()})
  logger.success(`Notification ${notification.id} sent for user ${notification.user.address}`)
}
