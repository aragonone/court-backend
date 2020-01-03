# Aragon Court backoffice app

This is a React app that aims to serve a UI to read data from an Aragon Court instance.

### Remote

1. [Mainnet](https://aragon-court.firebaseapp.com/)
2. [Rinkeby](https://aragon-court-rinkeby.firebaseapp.com/)
3. [Ropsten](https://aragon-court-ropsten.firebaseapp.com/)
4. [Staging](https://aragon-court-staging.firebaseapp.com/)

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
 
After that, make sure you provide a `.env` file with a GraphQL endpoint for your Aragon Court subgraph before starting the app.
For example, the next `.env` file will work for a local environment:

```bash
REACT_APP_GRAPHQL_ENDPOINT=http://localhost:8000/subgraphs/name/aragon/aragon-court-rpc
```

Alternatively, if you want to re-use one of the already deployed instances, you can simply specify a network name:

```bash
REACT_APP_NETWORK=rinkeby
```

Finally, you can simply run `npm start` to start playing with it.
