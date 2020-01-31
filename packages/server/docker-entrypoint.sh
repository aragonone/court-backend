#!/bin/sh

set -e

# TODO: wait for db server
sleep 30

npx sequelize db:create
npx sequelize db:migrate
npx sequelize db:seed:all

# npm start
exec "$@"
