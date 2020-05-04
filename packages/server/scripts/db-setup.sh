#!/bin/sh

# Wait for connection before Knex migrations
db_result=0
while [ "${db_result}" -ne "1" ]; do
    npm run knex -- migrate:currentVersion 2>&1 | grep 'connect ECONNREFUSED' > /dev/null
    db_result=$?
    if [ "${db_result}" -eq "0" ]; then
        echo "Waiting for DB..."
        sleep 5
    fi
done

echo "Running knex database migrations..."
npm run knex -- migrate:latest
if [ "$?" -ne "0" ]; then
    exit 1
fi

echo "Running knex seeds..."
npm run knex -- seed:run
if [ "$?" -ne "0" ]; then
    exit 1
fi

echo "Database is ready!"
