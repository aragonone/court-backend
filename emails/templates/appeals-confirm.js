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
    subject: '{{subject}}',
    template: base(
      {
        title: 'Notifications',
        subtitle: `Your account ${addressBadge()} received a notification on {{date}}`,
      },
      `
        ${infobox({
          mode: 'negative',
          primary: `Celeste ${link('Dispute #20','https://court.aragon.org/#/disputes/20')} and ${link('Dispute #21','https://court.aragon.org/#/disputes/21')} have been APPEALED.`,
          secondary: `Anyone can now CONFIRM the appeal to challenge the outcome proposed by the appealing party. If you disagree with the rulings proposed by the appealing party, visit the Celeste Dashboard to confirm these appeals: ${link(
            'https://court.aragon.org/#/disputes',
            'https://court.aragon.org/#/disputes'
          )}`,
        })}
        ${action('Learn more about appeals', 'https://help.aragon.org/article/43-dispute-lifecycle#appeal', { padding: '16px 0 0' })}
      `
    ),
    templateText: `
      Celeste Notifications

      Your account {{account}} received a notification on {{date}}:

      {{subject}}
      Anyone can now CONFIRM the appeal to challenge the outcome proposed by the appealing party. If you disagree with the rulings proposed by the appealing party, visit the Celeste Dashboard to confirm these appeals: https://court.aragon.org/#/disputes

      Learn more about appeals: https://help.aragon.org/article/43-dispute-lifecycle#appeal
      ${textFooter()}
    `,
    mockData: {
      subject: 'Celeste Dispute #20 and Dispute #21 have been APPEALED.',
      ...accountData('0xef0f7ecef8385483ac8a2e92d761f571c4b782bd'),
      date: 'Thursday, 17 Dec. 2019',
    },
  }
}
