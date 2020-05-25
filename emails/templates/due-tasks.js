const {
  addressBadge,
  base,
  dataTable,
  link,
  vspace,
} = require('../template-utils')
const { accountData } = require('../helpers')

module.exports = function() {
  return {
    subject: 'You have pending tasks on Aragon Court',
    template: base(
      {
        title: 'Task Reminder',
        subtitle: `Your account ${addressBadge()} received a reminder for pending tasks on {{date}}`,
      },
      `
        <div style="font-size:16px;line-height:16px;color:#212B36;">
          You have tasks due soon:
        </div>
        ${vspace(40)}

        ${dataTable('tasks', [
          ['{{name}}', 'TASK'],
          [link('Dispute #{{disputeId}}', '{{disputeUrl}}'), 'DISPUTE'],
          ['{{dueDate}}', 'DUE DATE'],
        ])}
      `
    ),
    templateText: `
      Aragon Court Notifications

      You have tasks due soon:
      {{#each tasks}}

      Task: {{name}} (dispute #{{disputeId}})
      Due date: {{dueDate}}
      Address: {{disputeUrl}}
      {{/each}}

      This service is provided by Aragon One AG [1]. You are receiving this email
      because you are subscribed to Aragon Court Email Notifications. You can
      contact us at support@aragon.org if you not longer wish to receive these.

      [1] https://aragon.one/
    `,
    mockData: {
      ...accountData('0xef0f7ecef8385483ac8a2e92d761f571c4b782bd'),
      date: 'Thursday, 17 Dec. 2019',
      tasks: [
        {
          name: 'Commit vote',
          disputeId: '12',
          disputeUrl: 'http://example.org/#12',
          dueDate: `18 Dec. 2019 at 12:46pm`,
        },
        {
          name: 'Reveal vote',
          disputeId: '14',
          disputeUrl: 'http://example.org/#14',
          dueDate: `18 Dec. 2019 at 2:50pm`,
        },
      ],
    },
  }
}
