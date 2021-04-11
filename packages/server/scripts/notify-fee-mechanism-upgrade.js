/**
 * Usage: npx babel-node scripts/notify-fee-mechanism-upgrade
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
import { trimMultiline } from '../../../emails/template-utils'
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
        TemplateAlias: 'generic',
        TemplateModel: {
          actionLabel: 'Go to the Aragon Forum Post',
          actionUrl: 'https://forum.aragon.org/t/request-for-comment-proposal-to-adjust-the-court-subscription-fee-mechanism/2163',
          title: 'Proposal to adjust the Court Subscription Fee Mechanism',
          bannerHtml: '',
          contentHtml: `
            <p>
              A proposal has been made to adjust the Court Subscription Fee Mechanism.
              The author is requesting comments for their proposal from Aragon community.
              You can read the proposal and leave comments on the forum post here:
            </p>
          `,
          content: trimMultiline(`
            A proposal has been made to adjust the Court Subscription Fee Mechanism.
            The author is requesting comments for their proposal from Aragon community.
            You can read the proposal and leave comments on the forum post here:
          `),
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
