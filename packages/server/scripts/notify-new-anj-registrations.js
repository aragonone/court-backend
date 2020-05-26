// usage: npx babel-node scripts/notify-new-anj-registrations.js
import { User } from '../src/models/objection'
import emailClient from '@aragonone/court-backend-shared/helpers/email-client'

async function main() {
  const users = await User.findNewAnjRegistrations()
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
