const { action, base, link, trimMultiline, vspace } = require('../template-utils')

module.exports = function() {
  return {
    template: base(
      {
        title: 'Email Verification',
        subtitle: '{{subtitle}}',
      },
      `
        <div style="font-size:16px;line-height:24px;color:#212B36">
          {{content}}
        </div>

        ${vspace(40)}

        ${action('{{actionLabel}}', '{{actionUrl}}')}

        ${vspace(40)}

        <div style="font-size:16px;line-height:24px;color:#212B36">
          Or copy and paste this URL into your browser:
          ${link('{{actionUrl}}', '{{actionUrl}}')}
        </div>
      `
    ),
    templateText: `
      Email Verification

      {{subtitle}}

      {{content}}

      {{actionLabel}}

      Or copy and paste this URL into your browser:
      {{actionUrl}}
    `,
    mockData: {
      date: 'Thursday, 17 Dec. 2019',
      subtitle: trimMultiline(`
        Verify your email to receive email notifications about important news
        and upcoming tasks.
      `),
      content: trimMultiline(`
        To complete the verification process, please click on the button
        below. Please note that by completing this process you are agreeing
        to receive email notifications from Aragon Court.
      `),
      actionLabel: 'Verify your email',
      actionUrl:
        'https://court.aragon.org/confirm?email=paty%40aragon.one&token=BxN5wBjmCz47mrx0KsfA9KvE&mode=signup',
    },
  }
}
