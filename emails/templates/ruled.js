const {
  action,
  addressBadge,
  base,
  infobox,
  link,
} = require('../template-utils')
const { accountData } = require('../helpers')

module.exports = function() {
  return {
    subject: 'The final ruling for Dispute #{{disputeId}} is “{{disputeResult}}”',
    template: base(
      {
        title: 'Notifications',
        subtitle: `Your account ${addressBadge()} received a notification on {{date}}`,
      },
      `
        ${infobox({
          mode: 'positive',
          primary: `The final ruling for ${link(
            'Dispute #{{disputeId}}',
            '{{disputeUrl}}',
            { nowrap: true }
          )} is “{{disputeResult}}”`,
          secondary: 'You can now see the final ruling and claim your rewards',
        })}
        ${action('See final ruling', '{{disputeUrl}}', {
          padding: '16px 0 0',
        })}
      `
    ),
    templateText: `
      Aragon Court Notifications

      Your account {{account}} received a notification on {{date}}:

      The final ruling for Dispute #{{disputeId}} is “{{disputeResult}}”. 
      You can now see the final ruling and claim your rewards.

      See final ruling: {{disputeUrl}}

      This service is provided by Aragon One AG [1]. You are receiving this email
      because you are subscribed to Aragon Court Email Notifications. You can
      contact us at support@aragon.org if you not longer wish to receive these.

      [1] https://aragon.one/
    `,
    mockData: {
      ...accountData('0xef0f7ecef8385483ac8a2e92d761f571c4b782bd'),
      date: 'Thursday, 17 Dec. 2019',
      disputeId: '14',
      disputeUrl: '',
      disputeResult: 'Allowed',
    },
  }
}
