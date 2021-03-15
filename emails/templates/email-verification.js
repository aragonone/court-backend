const {
  action,
  base,
  link,
  vspace,
  textFooter
} = require('../template-utils')

module.exports = function() {
  return {
    subject: 'Verify your email on Celeste',
    template: base(
      {
        title: 'Email Verification',
        subtitle: `
          Verify your email to receive email notifications about important news
          and upcoming tasks.
        `,
      },
      `
        <div style="font-size:16px;line-height:24px;color:#212B36">
          To complete the verification process, please click on the button
          below. Please note that by completing this process you are agreeing
          to receive email notifications from Celeste.
        </div>

        ${vspace(40)}

        ${action('Verify your email', '{{verifyEmailUrl}}')}

        ${vspace(40)}

        <div style="font-size:16px;line-height:24px;color:#212B36">
          Or copy and paste this URL into your browser:
          ${link('{{verifyEmailUrl}}', '{{verifyEmailUrl}}')}
        </div>
      `
    ),
    templateText: `
      Celeste Notifications

      Verify your email to receive email notifications about important news
      and upcoming tasks.

      Please note that by completing this process you are agreeing to receive
      email notifications from Celeste.

      Verify your email by copying and pasting this URL into your browser:
      {{verifyEmailUrl}}
      ${textFooter()}
    `,
    mockData: {
      verifyEmailUrl:
        'https://app.aragon.org/confirm?email=paty%40aragon.one&token=BxN5wBjmCz47mrx0KsfA9KvE&mode=signup',
    },
  }
}
