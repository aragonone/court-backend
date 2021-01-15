const {
  addressBadge,
  base,
  dataTable,
  link,
  vspace,
  textFooter
} = require('../template-utils')
const { accountData } = require('../helpers')

module.exports = function() {
  return {
    subject: 'You have pending tasks on Celeste',
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
      Celeste Task Reminder

      You have tasks due soon:
      {{#each tasks}}

      Task: {{name}} (dispute #{{disputeId}})
      Due date: {{dueDate}}
      Address: {{disputeUrl}}
      {{/each}}
      ${textFooter()}
    `,
    mockData: {
      ...accountData('0xef0f7ecef8385483ac8a2e92d761f571c4b782bd'),
      date: 'Thursday, 17 Dec. 2019',
      tasks: [
        {
          name: 'Commit vote',
          disputeId: '12',
          disputeUrl: 'http://example.org/#12',
          dueDate: `Thursday, April 23, 2020, 12:13pm UTC`,
        },
        {
          name: 'Reveal vote',
          disputeId: '14',
          disputeUrl: 'http://example.org/#14',
          dueDate: `Friday, April 24, 2020, 2:05am UTC`,
        },
      ],
    },
  }
}
