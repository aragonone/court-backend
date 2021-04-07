const {
  action,
  addressBadge,
  base,
  link,
  vspace,
  textFooter,
} = require('../template-utils')
const { accountData } = require('../helpers')

module.exports = function() {
  return {
    subject: 'Celeste email verification reminder',
    template: base(
      {
        title: 'Celeste',
        subtitle: `Your account ${addressBadge()} received a notification on {{date}}`,
      },
      `
        <div style="font-size:16px;line-height:24px;color:#212B36">
          You recently subscribed to Celeste email notifications, but did
          not complete the email verification process.
        </div>

        ${vspace(20)}

        <div style="font-size:16px;line-height:24px;color:#212B36">
          To do so, please click on the button below and 
          1) connect your account 
          2) go to your notification settings (top right)
          3) click “Resend verification email”
        </div>

        ${vspace(40)}

        ${action('Complete the verification process', '{{emailPreferencesUrl}}')}

        ${vspace(40)}

        <div style="font-size:16px;line-height:24px;color:#212B36">
          Or copy and paste this URL into your browser:
          ${link('{{emailPreferencesUrl}}', '{{emailPreferencesUrl}}')}
        </div>
      `
    ),
    templateText: `
      Celeste Notifications

      Your account {{account}} received a notification on {{date}}:

      You recently subscribed to Celeste email notifications, but did not
      complete the email verification process.

      To do so, please copy and paste this URL into your browser and 
      1) connect your account 
      2) go to your notification settings (top right)
      3) click “Resend verification email”
      {{emailPreferencesUrl}}
      ${textFooter()}
    `,
    mockData: {
      ...accountData('0xef0f7ecef8385483ac8a2e92d761f571c4b782bd'),
      date: 'Thursday, 17 Dec. 2019',
      emailPreferencesUrl:
        'https://app.aragon.org/?preferences=notifications',
    },
  }
}
