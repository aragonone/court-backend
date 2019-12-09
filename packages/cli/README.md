# Aragon Court CLI tool

This tool aims to provide a set of commands to interact with an Aragon Court instance.
Currently, there is no published version of it. However, you can run the following commands to install it locally:

```bash
  git clone https://github.com/aragon/aragon-court-backend/
  cd aragon-court-backend
  npm i
  npx lerna bootstrap
  cd packages/cli
```

The only thing you need to setup is to make sure you configure an Aragon Court address in the `truffle-config.js` file.
After that, you can start playing with all the provided commands: 

- `mint`: Mint ANJ or Fee tokens for a certain address
- `heartbeat`: Mint ANJ or Fee tokens for a certain address
- `stake`: Stake ANJ tokens for a juror
- `unstake`: Unstake ANJ tokens
- `activate`: Activate ANJ to the Court
- `deactivate`: Deactivate ANJ from the Court
- `arbitrable`: Create new Arbitrable instance for the Court
- `subscribe`: Subscribe Arbitrable instance to the Court
- `dispute`: Create dispute submitting evidence
- `draft`: Draft dispute and close evidence submission period if necessary
- `commit`: Commit vote for a dispute round
- `reveal`: Reveal committed vote
- `appeal`: Appeal dispute in favour of a certain outcome
- `confirm-appeal`: Confirm an existing appeal for a dispute
- `settle-round`: Settle penalties and appeals for a dispute
- `settle-juror`: Settle juror for a dispute
- `execute`: Execute ruling for a dispute
