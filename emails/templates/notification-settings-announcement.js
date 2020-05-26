const {
  action,
  base,
  vspace
} = require('../template-utils')

module.exports = function() {
  return {
    subject: 'Modify your email notification settings',
    template: base(
      {
        title: 'Modify your email notification settings',
        subtitle: `You have received this email since your provided your email on anj.aragon.org`,
      },
      `
        <div style="font-size:16px;line-height:24px;color:#212B36">
          You can now modify your email notification settings by visiting Court Dashboard.
        </div>

        ${vspace(20)}

        <div style="font-size:16px;line-height:24px;color:#212B36">
          To do so, please click on the button below and follow the instructions:
        </div>

        ${vspace(40)}

        ${action('Go to Court Dashboard', '{{dashboardUrl}}')}
      `
    ),
    templateText: `
      You have received this email since your provided your email on anj.aragon.org

      You can now modify your email notification settings by visiting Court Dashboard.

      To do so, please copy and paste this URL into your browser and follow the instructions:
      {{dashboardUrl}}
    `,
    mockData: {
      dashboardUrl: 'https://court.aragon.org/dashboard',
    },
  }
}
