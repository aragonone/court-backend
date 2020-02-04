# Aragon Court CLI tool

This tool aims to provide a set of commands to interact with an Aragon Court instance.
Currently, there is no published version of it. However, you can run the following commands to install it locally:

```bash
  git clone https://github.com/aragonone/court-backend/
  cd court-backend
  npm i
  npx lerna bootstrap
  cd packages/cli
```

The only thing you need to setup is to make sure you configure an Aragon Court address in the `truffle-config.js` file of the shared package.
After that, you can start playing with all the provided commands: 

- [`mint`](./src/commands/mint.js): Mint ANJ or Fee tokens for a certain address
- [`heartbeat`](./src/commands/hearbeat.js): Transition Court terms
- [`config`](./src/commands/config.js): Change Court config
- [`stake`](./src/commands/stake.js): Stake ANJ tokens for a juror
- [`unstake`](./src/commands/unstake.js): Unstake ANJ tokens
- [`activate`](./src/commands/activate.js): Activate ANJ to the Court
- [`deactivate`](./src/commands/deactivate.js): Deactivate ANJ from the Court
- [`arbitrable`](./src/commands/arbitrable.js): Create new Arbitrable instance for the Court
- [`subscribe`](./src/commands/subscribe.js): Subscribe Arbitrable instance to the Court
- [`dispute`](./src/commands/dispute.js): Create dispute submitting evidence
- [`draft`](./src/commands/draft.js): Draft dispute and close evidence submission period if necessary
- [`commit`](./src/commands/commit.js): Commit vote for a dispute round
- [`reveal`](./src/commands/reveal.js): Reveal committed vote
- [`appeal`](./src/commands/appeal.js): Appeal dispute in favour of a certain outcome
- [`confirm-appeal`](./src/commands/confirm-appeal.js): Confirm an existing appeal for a dispute
- [`settle-round`](./src/commands/settle-round.js): Settle penalties and appeals for a dispute
- [`settle-juror`](./src/commands/settle-juror.js): Settle juror for a dispute
- [`execute`](./src/commands/execute.js): Execute ruling for a dispute

## Config

### Keys

This repo is using `@aragon/truffle-config-v5`, it is not using Truffle, but truffle config to load the network configuration following the standard way provided by Truffle.
Thus, keys are fetched from `~/.aragon/${NETWORK}_key.json` files.
