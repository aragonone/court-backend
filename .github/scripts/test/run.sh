#!/bin/sh
DIR=$(dirname "$0")
cp .env.sample $DIR/.env
cd $DIR
export SERVER_IMAGE="$1"
docker-compose up -d
sleep 10 # wait for database migrations
docker-compose exec -T court_server npm run test:server
docker-compose exec -T court_server npm run test:services
docker-compose down
