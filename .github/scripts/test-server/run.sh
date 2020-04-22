#!/bin/sh
DIR=$(dirname "$0")
cp .env.sample $DIR/.env
cd $DIR
export SERVER_IMAGE=$REPO:${GITHUB_SHA}
docker-compose up -d
sleep 10
docker-compose exec -T court_server npm run test:server
