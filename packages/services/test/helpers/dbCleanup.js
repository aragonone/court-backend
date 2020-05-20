import { User, UserEmail, UserNotificationType } from '@aragonone/court-backend-server/build/models/objection'

export async function userDbCleanup(address, email) {
  await UserEmail.findOne({email}).del()
  await User.findOne({address}).del()
}

export async function userNotificationTypeDbCleanup(model) {
  await UserNotificationType.findOne({model}).del()
}
