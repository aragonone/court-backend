import { UserNotificationType } from '@aragonone/court-backend-server/build/models/objection'

export default function userNotificationTypeByModel(model) {
  return UserNotificationType.query().findOne({model}).withGraphFetched('notifications')
}
