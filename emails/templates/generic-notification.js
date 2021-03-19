const {
  action,
  addressBadge,
  asset,
  base,
  style,
  table,
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
        ${table(
          { align: 'center', width: '282' },
          `
            <tr>
              <td style="padding: 20px 0 50px;">
                <img width="282" src="{{headerUrl}}" alt="" style="display:block" />
              </td>
            </tr>
          `
        )}
        ${table(
          { align: 'center', width: '600' },
          `
            <tr>
              <td style="${style(`
                font-size: 18px;
                line-height: 27px;
                color: #8A96A0;
              `)}">
                {{{contentHtml}}}
              </td>
            </tr>
            <tr>
              <td style="${style(`
                padding-bottom: 50px;
              `)}">
                ${action('{{actionLabel}}', '{{actionUrl}}', {
                  padding: '16px 0 0',
                })}
              </td>
            </tr>
          `
        )}
      `
    ),
    templateText: `
      Celeste Notifications

      Your account {{account}} received a notification on {{date}}:

      {{title}}

      {{content}}

      {{actionLabel}}: {{actionUrl}}
      ${textFooter()}
    `,
    mockData: {
      ...accountData('0xef0f7ecef8385483ac8a2e92d761f571c4b782bd'),
      title: 'Claim your subscription rewards',
      content: trimMultiline(`
        Congratulations! You have been rewarded a portion of this month's
        Subscription rewards because your HNY was activated for a full Celeste
        period. Claim them in the ‘Rewards’ section of the Dashboard.
      `),
      contentHtml: `
        <h1>
          Claim your subscription rewards
        </h1>
        <p>
          Congratulations! You have been rewarded a portion of this month's
          Subscription rewards because your HNY was activated for a full Court
          period. Claim them in the ‘Rewards’ section of the Dashboard.
        </p>
      `,
      headerUrl: '',
      date: 'Thursday, 17 Dec. 2019',
      actionLabel: 'Claim rewards',
      actionUrl: '',
    },
  }
}
