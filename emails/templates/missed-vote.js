const {
  addressBadge,
  action,
  base,
  infobox,
  link,
  textFooter
} = require('../template-utils')
const { accountData } = require('../helpers')

module.exports = function() {
  return {
    subject: 'Your vote wasn’t cast on time',
    template: base(
      {
        title: 'Celeste',
        subtitle: `Your account ${addressBadge()} received a notification on {{date}}`,
      },
      `
        ${infobox({
          mode: 'negative',
          primary: `Your vote wasn’t cast on time for ${link(
            'Dispute #{{disputeId}}',
            '{{disputeUrl}}',
            { nowrap: true }
          )}`,
          secondary: `Some of your ${link(
            'locked HNY balance',
            '{{lockedAnjBalanceUrl}}'
          )} has been forfeit.`,
        })}
        ${action('Learn more', 'https://wiki.1hive.org/projects/celeste', { padding: '16px 0 0' })}
      `
    ),
    templateText: `
      Celeste Notifications

      Your account {{account}} received a notification on {{date}}:

      Your vote wasn’t cast on time for Dispute #{{disputeId}}. 
      Some of your locked HNY balance has been forfeit.

      Learn more: https://wiki.1hive.org/projects/celeste
      ${textFooter()}
    `,
    mockData: {
      ...accountData('0xef0f7ecef8385483ac8a2e92d761f571c4b782bd'),
      date: 'Thursday, 17 Dec. 2019',
      disputeId: '14',
      disputeUrl: '',
      lockedAnjBalanceUrl: 'https://court.aragon.org/dashboard'
    },
  }
}
