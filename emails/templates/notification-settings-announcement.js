const {
  action,
  base,
  vspace,
  textFooter
} = require('../template-utils')

module.exports = function() {
  return {
    subject: 'New on Aragon Court: modify your juror notification settings from the Dashboard',
    template: base(
      {
        title: 'Notification Settings',
        subtitle: `You have received this email because you provided your email on anj.aragon.org`,
      },
      `
        <div style="font-size:16px;line-height:24px;color:#212B36">
          You can now modify your email notification settings by visiting the Aragon Court Dashboard and connecting your Ethereum account.
        </div>

        ${vspace(20)}

        <div style="font-size:16px;line-height:24px;color:#212B36">
          To do so, please click on the button below and follow the instructions:
        </div>

        ${vspace(40)}

        ${action('Go to the Aragon Court Dashboard', '{{dashboardUrl}}')}
      `
    ),
    templateText: `
      Aragon Court Notification Settings

      You have received this email because you provided your email on anj.aragon.org.

      You can now modify your email notification settings by visiting the Aragon Court Dashboard and connecting your Ethereum account.

      To do so, please copy and paste this URL into your browser and follow the instructions:
      {{dashboardUrl}}
      ${textFooter()}
    `,
    mockData: {
      dashboardUrl: 'https://court.aragon.org/dashboard',
    },
  }
}
