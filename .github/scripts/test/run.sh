#!/bin/sh
set -e  # immediately fail script on any command error
DIR=$(dirname "$0")
cp .env.sample $DIR/.env
cd $DIR
export SERVER_IMAGE="$1"
docker-compose up -d
docker-compose exec court_server /bin/sh -c "npx wait-on http://localhost:\$SERVER_METRICS_PORT"
docker-compose exec -T court_server npm run test:server
docker-compose exec -T court_server npm run test:services
docker-compose down
