const {
  action,
  addressBadge,
  base,
  infobox,
  link,
  textFooter
} = require('../template-utils')
const { accountData } = require('../helpers')

module.exports = function() {
  return {
    subject: 'You have been selected to arbitrate Dispute #{{disputeId}} on Aragon Court',
    template: base(
      {
        title: 'Notifications',
        subtitle: `Your account ${addressBadge()} received a notification on {{date}}`,
      },
      `
        ${infobox({
          mode: 'positive',
          primary: `
            You have been selected to arbitrate ${link(
              'Dispute #{{disputeId}}',
              '{{disputeUrl}}',
              { nowrap: true }
            )}`,
          secondary:
            'You can start reviewing the arguments and then commit your vote',
        })}
        ${action('Review the arguments and vote', '{{disputeUrl}}', {
          padding: '16px 0 0',
        })}
      `
    ),
    templateText: `
      Aragon Court Notifications

      Your account {{account}} received a notification on {{date}}:

      You have been selected to arbitrate Dispute #{{disputeId}}. You can start
      reviewing the arguments and then commit your vote.

      Review the arguments and vote: {{disputeUrl}}
      ${textFooter()}
    `,
    mockData: {
      ...accountData('0xef0f7ecef8385483ac8a2e92d761f571c4b782bd'),
      date: 'Thursday, 17 Dec. 2019',
      disputeId: '14',
      disputeUrl: '',
    },
  }
}
