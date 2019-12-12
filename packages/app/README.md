# Aragon Court backoffice app

This is a React app that aims to serve a UI to read data from an Aragon Court instance.
It only needs an Aragon Court subgraph and a Web3 provider to work. 
Currently, there is no deployed instance of this app. However, you can run the following commands to run it locally:

```bash
  git clone https://github.com/aragon/aragon-court-backend/
  cd aragon-court-backend
  npm i
  npx lerna bootstrap
  cd packages/app
```
 
After that, make sure you provide a `.env` file with a GraphQL endpoint for your Aragon Court subgraph before starting the app.
For example, the next `.env` file will work for a local environment:

```bash
REACT_APP_GRAPHQL_ENDPOINT=http://localhost:8000/subgraphs/name/aragon/aragon-court-rpc
```

Finally, you can simply run `npm start` to start playing with it.
