# Aragon Court backoffice app

This is a React app that aims to serve a UI to read data from an Aragon Court instance.

### Instances

You can find the following deployed instances

1. [Mainnet](https://court-backend-app.eth.aragon.network/)
1. [Rinkeby](https://court-backend-app-rinkeby.eth.aragon.network/)
1. [Staging](https://court-backend-app-staging.eth.aragon.network/)
1. [Ropsten](https://court-backend-app-ropsten.eth.aragon.network/)

### Setup

To work locally, simply go to the root directory, and make sure you have set up a propoer `.env` file following the `.env.sample` file.
Once you have done that, spin up a docker container with:
```bash
docker-compose build
docker-compose up -d
```

### Keys

This repo web3 configuration relies on a browser provider like Metamask. However, it doesn't require a browser connection to read data since it is mostly consumes Aragon Court's subgraph.
