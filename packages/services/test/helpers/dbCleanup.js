import { User, UserEmail, UserNotificationType } from '@aragonone/court-backend-server/build/models/objection'

export async function userDbCleanup(address, email) {
  address = address.toLowerCase()
  await UserEmail.query().where({email}).del()
  await User.query().where({address}).del()
}

export async function userNotificationTypeDbCleanup(model) {
  await UserNotificationType.query().where({model}).del()
}
