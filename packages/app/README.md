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
 
After that make sure you provide a `.env` file as follows before starting the app:

```bash
REACT_APP_WEB3_HTTP_PROVIDER=
REACT_APP_GRAPHQL_ENDPOINT=
```

Finally, you can simply run `npm start` to start playing with it.
