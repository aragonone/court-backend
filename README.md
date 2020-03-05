# Aragon Court backend

This mono-repo includes a set of sub-repos that are in charge of different parts of the whole Aragon Court backend:
- [`cli`](./packages/cli): This repo provides a CLI tool with a set of commands to interact with an Aragon Court instance.
- [`server`](./packages/server): This repo provides the backend server in charge of setting up a database and exposing a set of endpoints that will complement the functionality exposed by the smart contracts.
- [`services`](./packages/services): This repo provides a set of background workers in charge of maintaining those things that could be done automatically for Aragon Court.
- [`app`](./packages/app): This repo provides a React app as the frontend app of the Aragon Court backend
- [`shared`](./packages/shared): This repo provides a set of components shared among all the sub-repos of this mono-repo.

To understand better about these repos, you will find detailed information about them on their own READMEs.
However, you can follow the following guide to understand you to set up everything locally:

### Local set up

To test Aragon Court locally please do the following tasks:

##### 1. Install Ganache and The Graph
First, make sure you have both Ganache and Graph CLIs
 
```bash
  npm install -g ganache-cli
  npm install -g @graphprotocol/graph-cli
```

##### 2. Start Ganache node
Start a local ganache in a separate terminal with the following params:

```bash
  ganache-cli -h 0.0.0.0 -i 15 --gasLimit 8000000 --deterministic
```

##### 3. Start Graph node
In another terminal, clone the graph node and start it:

```bash
  git clone https://github.com/graphprotocol/graph-node/
  cd graph-node/docker
  npm i
  rm -rf data
  docker-compose up
```

> If docker prompts you with the error `The reorg threshold 50 is larger than the size of the chain 7, you probably want to set the ETHEREUM_REORG_THRESHOLD environment variable to 0`, 
  simply add a new env variable in `docker-compose.yml` named `ETHEREUM_REORG_THRESHOLD` assigning it to 0 and start it again.

##### 4. Deploy local Aragon Court instance
To deploy a local instance run the following commands on a separate terminal:

```bash
  git clone https://github.com/aragon/aragon-network-deploy/
  cd aragon-network-deploy
  npm i
  npm run deploy:court:rpc
```

##### 5. Deploy Aragon Court subgraph
You can use the provided deployment script to create a manifest file with the providing the court deployed address as follows:

```bash
  NETWORK=rpc COURT=<COURT_ADDRESS> ./scripts/deploy
``` 

##### 6. Populate Aragon Court
You can use Aragon Court's backend CLI to start playing with your deployed instance.
First, open a separate terminal, clone this repo and install dependencies:

```bash
  git clone https://github.com/aragonone/court-backend/
  cd court-backend
  npm i
  npx lerna bootstrap
```

Finally, make sure you set the local court address in `packages/shared/truffle-config.js`.
You can now start playing with the available CLI commands:

- `mint`: Mint ANJ or Fee tokens for a certain address
- `heartbeat`: Transition Court terms
- `config`: Change Court config
- `stake`: Stake ANJ tokens for a juror
- `unstake`: Unstake ANJ tokens
- `activate`: Activate ANJ to the Court
- `deactivate`: Deactivate ANJ from the Court
- `donate`: Donate funds to Court jurors
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

You can also use the `rpc:setup` NPM command to populate your local Aragon Court instance with jurors and disputes.

##### 7. Test Aragon Court's back-office app 

Optionally, you can try the back-office app to see all your actions on a UI. 
To do that, open a separate terminal on the cloned `aragon-court-backend` repo and go to the `packages/app` dir.
After that, make sure you provide a `.env` file with a GraphQL endpoint for your Aragon Court subgraph before starting the app.
For example, the next `.env` file will work for a local environment:

```bash
REACT_APP_NETWORK=rpc
```

Finally, you can simply run `npm start` to start playing with it.

### Deployed instances

You can find the following instances that were already deployed:

1. [Mainnet](https://aragon-court.firebaseapp.com/)
2. [Rinkeby](https://aragon-court-rinkeby.firebaseapp.com/)
3. [Ropsten](https://aragon-court-ropsten.firebaseapp.com/)
4. [Staging](https://aragon-court-staging.firebaseapp.com/)
5. [Usability](https://aragon-court-usability.firebaseapp.com/)
