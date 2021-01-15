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
    subject: 'Your vote wasn’t revealed on time',
    template: base(
      {
        title: 'Notifications',
        subtitle: `Your account ${addressBadge()} received a notification on {{date}}`,
      },
      `
        ${infobox({
          mode: 'negative',
          primary: `Your vote wasn’t revealed on time for ${link(
            'Dispute #{{disputeId}}',
            '{{disputeUrl}}',
            { nowrap: true }
          )}`,
          secondary: `Some of your ${link(
            'locked ANJ balance',
            '{{lockedAnjBalanceUrl}}'
          )} has been forfeit.`,
        })}
        ${action('Learn more', 'https://help.aragon.org/article/43-dispute-lifecycle#vote-reveal', { padding: '16px 0 0' })}
      `
    ),
    templateText: `
      Celeste Notifications

      Your account {{account}} received a notification on {{date}}:

      Your vote wasn’t revealed on time for Dispute #{{disputeId}}.
      Some of your locked ANJ balance has been forfeit.

      Learn more: https://help.aragon.org/article/43-dispute-lifecycle#vote-reveal
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
