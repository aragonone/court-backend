import dotenv from 'dotenv'
import { UserNotificationType } from '../../models/objection'

dotenv.config()

export async function seed() {
  const notificationTypes = [
    'subscription-reminder',
  ]
  for (const type of notificationTypes) {
    await UserNotificationType.findOrInsert({type})
  }
}
