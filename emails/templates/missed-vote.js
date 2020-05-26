const {
  addressBadge,
  action,
  base,
  infobox,
  link,
} = require('../template-utils')
const { accountData } = require('../helpers')

module.exports = function() {
  return {
    subject: 'Your vote wasn’t cast on time',
    template: base(
      {
        title: 'Notifications',
        subtitle: `Your account ${addressBadge()} received a notification on {{date}}`,
      },
      `
        ${infobox({
          mode: 'negative',
          primary: `Your vote wasn’t cast on time`,
          secondary: `Some of your ${link(
            'locked ANJ balance',
            'https://court.aragon.org/dashboard'
          )} has been forfeit.`,
        })}
        ${action('Learn more', 'https://help.aragon.org/article/43-dispute-lifecycle#voting-period', { padding: '16px 0 0' })}
      `
    ),
    templateText: `
      Aragon Court Notifications

      Your account {{account}} received a notification on {{date}}:

      Your vote wasn’t cast on time. Some of your locked ANJ [1] balance has
      been forfeit.

      Learn more: https://help.aragon.org/article/43-dispute-lifecycle#voting-period

      This service is provided by Aragon One AG [2]. You are receiving this
      email because you are subscribed to Aragon Court Email Notifications. You
      can contact us at support@aragon.org if you not longer wish to receive
      these.

      [1] https://court.aragon.org/dashboard
      [2] https://aragon.one/
    `,
    mockData: {
      ...accountData('0xef0f7ecef8385483ac8a2e92d761f571c4b782bd'),
      date: 'Thursday, 17 Dec. 2019',
    },
  }
}
