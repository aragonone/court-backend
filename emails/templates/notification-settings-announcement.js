const {
  action,
  base,
  vspace,
  textFooter
} = require('../template-utils')

module.exports = function() {
  return {
    subject: 'New on Celeste: modify your juror notification settings from the Dashboard',
    template: base(
      {
        title: 'Notification Settings',
        subtitle: `You have received this email because you provided your email`,
      },
      `
        <div style="font-size:16px;line-height:24px;color:#212B36">
          You can now modify your email notification settings by visiting the Celeste Dashboard and connecting your Ethereum account.
        </div>

        ${vspace(20)}

        <div style="font-size:16px;line-height:24px;color:#212B36">
          To do so, please click on the button below and follow the instructions:
        </div>

        ${vspace(40)}

        ${action('Go to the Celeste Dashboard', '{{dashboardUrl}}')}
      `
    ),
    templateText: `
      Celeste Notification Settings

      You have received this email because you provided your email on anj.aragon.org.

      You can now modify your email notification settings by visiting the Celeste Dashboard and connecting your Ethereum account.

      To do so, please copy and paste this URL into your browser and follow the instructions:
      {{dashboardUrl}}
      ${textFooter()}
    `,
    mockData: {
      dashboardUrl: 'https://court.aragon.org/dashboard',
    },
  }
}
