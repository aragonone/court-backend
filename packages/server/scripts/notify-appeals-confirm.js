/**
 * Usage: npx babel-node scripts/notify-appeals-confirm
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
import { accountData } from '../../../emails/helpers'
dotenv.config()

async function main() {
  const users = await User.findWithoutDisabledNotifications()
  const emails = new Set()
  for (const user of users) {
    const { email: { email }, address } = user
    if (emails.has(email.toLowerCase())) continue
    emails.add(email.toLowerCase())
    try {
      await emailClient.sendEmailWithTemplate({
        To: email,
        From: 'celeste@1hive.org',
        TemplateAlias: 'appeals-confirm',
        TemplateModel: {
          subject: 'Celeste Dispute #20 and Dispute #21 have been APPEALED.',
          ...accountData(address),
          date: 'Tuesday, 8 Sep. 2020'
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
