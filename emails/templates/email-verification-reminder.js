const { action, base, link, vspace } = require('../template-utils')

module.exports = function() {
  return {
    template: base(
      {
        title: 'Email Verification Reminder',
        subtitle: `
          Verify your email to receive email notifications about important news
          and upcoming tasks.
        `,
      },
      `
        <div style="font-size:16px;line-height:24px;color:#212B36">
          You recently subscribed to Aragon Court email notifications, but did
          not complete the email verification process.
        </div>

        ${vspace(20)}

        <div style="font-size:16px;line-height:24px;color:#212B36">
          To do so, please click on the button below and follow
          the instructions:
        </div>

        ${vspace(40)}

        ${action('Complete the verification process', '{{emailSettingsUrl}}')}

        ${vspace(40)}

        <div style="font-size:16px;line-height:24px;color:#212B36">
          Or copy and paste this URL into your browser:
          ${link('{{emailSettingsUrl}}', '{{emailSettingsUrl}}')}
        </div>
      `
    ),
    templateText: `
      Email Verification

      Verify your email to receive email notifications about important news
      and upcoming tasks.

      You recently subscribed to Aragon Court email notifications, but did not
      complete the email verification process.

      To do so, please copy and paste this URL into your browser and follow 
      the instructions:
      {{emailSettingsUrl}}
    `,
    mockData: {
      emailSettingsUrl:
        'https://app.aragon.org/?preferences=notifications',
    },
  }
}
