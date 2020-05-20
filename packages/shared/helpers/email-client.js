const { ServerClient } = require('postmark')

const { env: {
  CLIENT_URL,
  EMAIL_FROM_DEFAULT,
  POSTMARK_SERVER_API_TOKEN,
  POSTMARK_TEMPLATE_ALIAS_VERIFY,
}} = process
const postmarkClient = new ServerClient(POSTMARK_SERVER_API_TOKEN)

class EmailClient {
  async sendMagicLink({ email, address, token }) {
    const verifyEmailUrl = `${CLIENT_URL}?preferences=notifications&address=${address}&token=${token}`
    const message = {
      To: email,
      TemplateAlias: POSTMARK_TEMPLATE_ALIAS_VERIFY,
      TemplateModel: { verifyEmailUrl },
    }
    await this.sendEmailWithTemplate(message)
  }

  async sendEmail(message) {
    message = this._sanitizeMessage(message)
    await postmarkClient.sendEmail(message)
  }

  async sendEmailWithTemplate(message) {
    message = this._sanitizeMessage(message)
    // simply check postmark endpoint when testing.
    // there is no way to run template test as of 2020-05-04:
    // https://github.com/wildbit/postmark.js/issues/56
    if (POSTMARK_SERVER_API_TOKEN == 'POSTMARK_API_TEST') {
      message.TextBody = 'test'
      delete message.TemplateAlias
      delete message.TemplateModel
      return await this.sendEmail(message)
    }
    await postmarkClient.sendEmailWithTemplate(message)
  }

  _sanitizeMessage(message) {
    message.From = this._sanitizeFrom(message.From)
    message.To = this._sanitizeTo(message.To)
    return message
  }

  _sanitizeFrom(From) {
    return From || EMAIL_FROM_DEFAULT
  }

  _sanitizeTo(To) {
    return Array.isArray(To) ? To.join(', ') : To
  }
}

module.exports = new EmailClient()
