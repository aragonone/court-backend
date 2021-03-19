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
    subject: '{{title}}',
    template: base(
      {
        title: 'Celeste',
        subtitle: `Your account ${addressBadge()} received a notification on {{date}}`,
      },
      `
        ${infobox({
          primary: '{{{titleHtml}}}',
          secondary: '{{{actionTextHtml}}}',
        })}
        ${action('Go to dashboard', 'https://celeste-rinkeby.1hive.org', {
          padding: '16px 0 0',
        })}
      `
    ),
    templateText: `
      Celeste Notifications

      Your account {{account}} received a notification on {{date}}:

      {{title}}

      {{actionText}}

      Go to dashboard: https://celeste-rinkeby.1hive.org
      ${textFooter()}
    `,
    mockData: {
      ...accountData('0xef0f7ecef8385483ac8a2e92d761f571c4b782bd'),
      date: 'Thursday, 17 Dec. 2019',
      title: 'Dispute #0 has been settled and fee reimbursements completed.',
      actionText: trimMultiline(`
        You are recieving this notification because you have been reimbursed for
        losses incurred from your involvement in Dispute #0.

        Keepers drafted and slashed in Dispute #0 have been sent reimbursements for
        their slashed amount. If you are an active keeper, the HNY has been added
        to your Active Balance and if you are an inactive keeper HNY has been
        added to your Inactive Balance.

        Appealers can claim their collateral through the Dashboard now that the
        dispute has been settled. Appeal fees have been reimbursed directly to
        your account.
      `),
      titleHtml: `
        ${link('Dispute #1', 'https://celeste-rinkeby.1hive.org/disputes/1', {
          nowrap: true,
        })} has been settled and fees reimbursements completed.
      `,
      actionTextHtml: `
        <p>
          You are recieving this notification because you have been reimbursed
          for losses incurred from your involvement in Dispute #0.
        </p>

        <p>
          <strong>Keepers</strong> drafted and slashed in Dispute #0 have been
          sent reimbursements for their slashed amount. If you are an active
          keeper, the HNY has been added to your Active Balance and if you are
          an inactive keeper HNY has been added to your Inactive Balance.
        </p>

        <p>
          <strong>Appealers</strong> can claim their collateral through the
          Dashboard now that the dispute has been settled. Appeal fees have
          been reimbursed directly to your account.
        </p>
      `,
    },
  }
}
