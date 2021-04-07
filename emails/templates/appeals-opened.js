const {
  action,
  addressBadge,
  base,
  infobox,
  link,
  trimMultiline,
  textFooter
} = require('../template-utils')
const { accountData } = require('../helpers')

module.exports = function() {
  return {
    subject: 'Appeals are open for Dispute #{{disputeId}}',
    template: base(
      {
        title: 'Celeste',
        subtitle: `Your account ${addressBadge()} received a notification on {{date}}`,
      },
      `
        ${infobox({
          mode: 'appeals-opened',
          primary: `
            Appeals are now open for a preliminary ruling of ${link(
              'Dispute #{{disputeId}}',
              '{{disputeUrl}}',
              { nowrap: true }
            )}`,
          secondary: trimMultiline(`
            Now that voting has ended, preliminary rulings can be appealed by
            anyone, including you. If you disagree with the ruling made by your
            fellow keepers and believe it will be overturned by a larger set of
            keepers, you can appeal the dispute and earn a reward if your appeal
            is successful.
          `),
        })}
        ${action('Appeal ruling', '{{disputeUrl}}', {
          padding: '16px 0 0',
        })}
      `
    ),
    templateText: `
      Celeste Notifications

      Your account {{account}} received a notification on {{date}}:

      Appeals are now open for a preliminary ruling of Dispute #{{disputeId}}.

      Now that voting has ended, preliminary rulings can be appealed by
      anyone, including you. If you disagree with the ruling made by your
      fellow keepers and believe it will be overturned by a larger set of
      keepers, you can appeal the dispute and earn a reward if your appeal
      is successful.

      Appeal ruling: {{disputeUrl}}
      ${textFooter()}
    `,
    mockData: {
      ...accountData('0xef0f7ecef8385483ac8a2e92d761f571c4b782bd'),
      date: 'Thursday, 17 Dec. 2019',
      disputeId: '14',
      disputeUrl: 'https://example.org/',
    },
  }
}
