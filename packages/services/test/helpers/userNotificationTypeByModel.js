import { UserNotificationType } from '@1hive/celeste-backend-server/build/models/objection'

export default function userNotificationTypeByModel(model) {
  return UserNotificationType.findOne({model}).withGraphFetched('notifications')
}
