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
        title: 'Celeste',
        subtitle: `Your account ${addressBadge()} received a notification on {{date}}`,
      },
      `
        ${infobox({
          mode: 'negative',
          primary: `{{subject}}`,
          secondary: `Anyone can now CONFIRM the appeal to challenge the outcome proposed by the appealing party. If you disagree with the ruling proposed by the appealing party, visit the Celeste Dashboard to confirm the appeal: ${link(
            'https://celeste-rinkeby.1hive.org/#/disputes',
            'https://celeste-rinkeby.1hive.org/#/disputes'
          )}`,
        })}
        ${action('Learn more about appeals', 'https://wiki.1hive.org/projects/celeste', { padding: '16px 0 0' })}
      `
    ),
    templateText: `
      Celeste Notifications

      Your account {{account}} received a notification on {{date}}:

      {{subject}}
      Anyone can now CONFIRM the appeal to challenge the outcome proposed by the appealing party. If you disagree with the rulings proposed by the appealing party, visit the Celeste Dashboard to confirm these appeals: https://court.aragon.org/#/disputes

      Learn more about appeals: https://wiki.1hive.org/projects/celeste
      ${textFooter()}
    `,
    mockData: {
      subject: 'Celeste Dispute #20 and Dispute #21 have been APPEALED.',
      ...accountData('0xef0f7ecef8385483ac8a2e92d761f571c4b782bd'),
      date: 'Thursday, 17 Dec. 2019',
    },
  }
}
