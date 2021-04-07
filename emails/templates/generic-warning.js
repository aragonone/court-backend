const {
  asset,
  banner,
  base2,
  button,
  trimMultiline,
  textFooter
} = require('../template-utils')

module.exports = function() {
  return {
    subject: '{{title}}',
    template: base2(
      {
        title: '{{title}}',
        preheader: '',
        banner: '{{{bannerHtml}}}',
        warningTitle: 'IMPORTANT NOTICE',
        warningContent: '{{{noticeHtml}}}',
      },
      `
        <h1>{{title}}</h1>
        <div style="color: #8A96A0">
          {{{contentHtml}}}
        </div>
        <div style="padding: 20px 0 10px">
          ${button('{{actionLabel}}', '{{actionUrl}}')}
        </div>
      `
    ),
    templateText: `
      {{title}}

      Important notice:

      {{notice}}

      {{content}}

      {{actionLabel}}: {{actionUrl}}
      ${textFooter()}
    `,
    mockData: {
      actionLabel: 'Try the Playground',
      actionUrl: 'http://example.org/',
      title: 'Open Rinkeby environment',
      bannerHtml: banner({
        height: 388,
        url: asset('banner-1.png'),
        color: '#ffffff',
        tag: { label: 'TEST NETWORK', bg: '#7C80F2', fg: '#ffffff' },
      }),
      contentHtml: `
        <p>
          The Juror Playground is a separate instance of the Juror Dashboard and
          Celeste on the Rinkeby testnet.
        </p>

        <p>
          We’re opening the Playground to existing keepers who wish to participate
          in stress-testing the Dashboard and Court.
        </p>

        <p>
          This is a perfect opportunity for keepers looking to familiarize
          themselves with the Dashboard in a safe environment before adjudicating
          disputes on mainnet.
        </p>

        <p>
          As always with testnets, the tokens will be valueless, so keepers are
          not subject to real financial risks (or rewards) when using the
          Playground.
        </p>

        <p>
          To get started, fill out the form linked below.
        </p>

        <p>
          Have fun, and break things!
        </p>
      `,
      content: trimMultiline(`
        The Juror Playground is a separate instance of the Juror Dashboard and
        Celeste on the Rinkeby testnet.

        We’re opening the Playground to existing keepers who wish to participate
        in stress-testing the Dashboard and Court.

        This is a perfect opportunity for keepers looking to familiarize
        themselves with the Dashboard in a safe environment before adjudicating
        disputes on mainnet.

        As always with testnets, the tokens will be valueless, so keepers are
        not subject to real financial risks (or rewards) when using the
        Playground.

        To get started, fill out the form linked below.

        Have fun, and break things!
      `),
      noticeHtml: `
        This is an email from <strong>Celeste’s Rinkeby test environment</strong>. This
        environment has been configured so keepers can have a playground to try
        out the new dashboard and ensure that the system is working
        correctly.
      `,
      notice: trimMultiline(`
        This is an email from Celeste’s Rinkeby test environment. This
        environment has been configured so keepers can have a playground to try
        out the new dashboard and ensure that the system is working
        correctly.
      `),
    },
  }
}
