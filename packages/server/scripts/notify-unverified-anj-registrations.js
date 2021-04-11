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
import emailClient from '@1hive/celeste-backend-shared/helpers/email-client'
import dotenv from 'dotenv'
dotenv.config()

async function main() {
  const users = await User.findUnverifiedAnjRegistrations()
  const emails = new Set()
  for (const user of users) {
    const { email: { email }, address } = user
    if (emails.has(email.toLowerCase())) continue
    emails.add(email.toLowerCase())
    try {
      await emailClient.sendEmailWithTemplate({
        To: email,
        From: 'celeste@1hive.org',
        TemplateAlias: 'notification-settings-announcement',
        TemplateModel: {
          dashboardUrl: 'https://celeste-rinkeby.1hive.org/#/dashboard',
        },
      })
    } catch (err) {
      console.log(err.message)
    }
    console.log(`sent email to ${email} for address ${address}`)
  }
  console.log(`Total emails: ${emails.size}`)
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
