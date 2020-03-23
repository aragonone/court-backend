#!/bin/sh

# wait for DB
db_result=0
while [ "${db_result}" -ne "1" ]; do
    echo "Waiting for DB..."
    npx sequelize db:migrate:status 2>&1 | grep 'connect ECONNREFUSED' > /dev/null
    db_result=$?
    if [ "${db_result}" -eq "0" ]; then
        sleep 5
    fi
done

echo "DB is up!"

# Check DB creation
npx sequelize db:migrate:status 2>&1 | grep 'database .* does not exist' > /dev/null
result=$?
if [ "${result}" -eq "0" ]; then
    echo "Creating Database"
    npx sequelize db:create
    create_result=$?
    if [ "${create_result}" -ne "0" ]; then
        echo "Error creating Database"
        exit 1
    fi
fi

# Check DB migration
npx sequelize db:migrate:status | grep "down" > /dev/null
result=$?
if [ "${result}" -eq "0" ]; then
    echo "Migrating Database"
    npx sequelize db:migrate
    migrate_result=$?
    if [ "${migrate_result}" -ne "0" ]; then
        echo "Error migrating Database"
        exit 1
    fi
fi

echo "Seeding Database"
npx sequelize db:seed:all > /dev/null 2>&1

exec "$@"
