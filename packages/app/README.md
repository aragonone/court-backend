# Aragon Court backoffice app

This is a React app that aims to serve a UI to read data from an Aragon Court instance.

## Setup

### Remote

You can find the following deployed instances

1. [Mainnet](https://aragon-court.firebaseapp.com/)
2. [Rinkeby](https://aragon-court-rinkeby.firebaseapp.com/)
3. [Ropsten](https://aragon-court-ropsten.firebaseapp.com/)
4. [Staging](https://aragon-court-staging.firebaseapp.com/)
5. [Usability](https://aragon-court-usability.firebaseapp.com/)

However, to deploy a new instance remotely, simply run `npm run deploy:{$NETWORK}` where `$NETWORK` could be one of (`ropsten`, `rinkeby`, `staging`, or `mainnet`).

### Local

To work locally, you only need an Aragon Court subgraph and a Web3 provider. 
You can run the following commands to build it locally:

```bash
  git clone https://github.com/aragonone/court-backend/
  cd court-backend
  npm i
  npx lerna bootstrap
  cd packages/app
```
 
After that, make sure you provide a `.env` file with a network name specified before starting the app.
For example, the next `.env` file will work for a local environment:

```bash
REACT_APP_NETWORK=rpc
```

Finally, you can simply run `npm start` to start playing with it.

## Config

### Keys

This repo web3 configuration relies on a browser provider like Metamask. However, it doesn't require a browser connection to read data since it is mostly consumes Aragon Court's subgraph.
