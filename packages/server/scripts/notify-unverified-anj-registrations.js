/**
 * Usage: npx babel-node scripts/notify-unverified-anj-registrations
 * requires .env file / env vars with
 * DB_NAME=
 * DB_USER=
 * DB_PASS=
 * DB_PORT=
 * DB_HOST=
 * POSTMARK_SERVER_API_TOKEN=
 */
import { User } from '../src/models/objection'
import emailClient from '@aragonone/court-backend-shared/helpers/email-client'
import dotenv from 'dotenv'
dotenv.config()

async function main() {
  const users = await User.findUnverifiedAnjRegistrations()
  for (const user of users) {
    const { email: { email }, address } = user
    await emailClient.sendEmailWithTemplate({
      To: email,
      TemplateAlias: 'notification-settings-announcement',
      TemplateModel: {
        dashboardUrl: 'https://court.aragon.org/dashboard',
      },
    })
    console.log(`sent email to ${email} for address ${address}`)
  }
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
