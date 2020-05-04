import { ServerClient } from 'postmark'

const { env: {
  EMAIL_FROM_ADDRESS,
  EMAIL_VERIFICATION_TARGET_HOST,
  POSTMARK_SERVER_API_TOKEN,
  POSTMARK_TEMPLATE_ALIAS_VERIFY,
}} = process
const emailClient = new ServerClient(POSTMARK_SERVER_API_TOKEN)

async function sendMagicLink({ email, address, token }) {

  // simply check postmark endpoint when testing.
  // there is no way to run template test as of 2020-05-04:
  // https://github.com/wildbit/postmark.js/issues/56
  if (POSTMARK_SERVER_API_TOKEN == 'POSTMARK_API_TEST') {
    return await emailClient.sendEmail({
      From: EMAIL_FROM_ADDRESS,
      To: email,
      TextBody: 'test',
    })
  }

  const verifyEmailUrl = `${EMAIL_VERIFICATION_TARGET_HOST}?address=${address}&token=${token}`
  const emailOptions = {
    From: EMAIL_FROM_ADDRESS,
    To: email,
    TemplateAlias: POSTMARK_TEMPLATE_ALIAS_VERIFY,
    TemplateModel: { verifyEmailUrl },
  }
  await emailClient.sendEmailWithTemplate(emailOptions)
}

export { sendMagicLink }
