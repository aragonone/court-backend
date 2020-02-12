#!/usr/bin/env bash

# Exit script as soon as a command fails.
set -o errexit

# Validate network
networks=(rpc ropsten rinkeby staging mainnet)
if [[ -z $NETWORK || ! " ${networks[@]} " =~ " ${NETWORK} " ]]; then
  echo 'Please make sure the network provided is either rpc, ropsten, rinkeby, staging or mainnet.'
  exit 1
fi

# Backup .env file if exists
if test -f ".env"; then
  mv .env .env.tmp
fi

# Use custom subgraph name based on target network
if [[ "$NETWORK" != "mainnet" ]]; then
  SUBGRAPH_EXT="-${NETWORK}"
else
  SUBGRAPH_EXT=""
fi

# Create new env file
echo "REACT_APP_GRAPHQL_ENDPOINT=https://api.thegraph.com/subgraphs/name/aragon/aragon-court${SUBGRAPH_EXT}" >> .env

# Build production files
export NODE_OPTIONS=--max_old_space_size=4096
npm run build

# Deploy
npx firebase deploy -P ${NETWORK}

# Rollback previous env file
rm .env
if test -f ".env.tmp"; then
  mv .env.tmp .env
fi
