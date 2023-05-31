#!/bin/bash

sed -e "s/\${MYSQL_ROOT_PASSWORD}/$MYSQL_ROOT_PASSWORD/g" \
    -e "s/\${MYSQL_USER}/$MYSQL_USER/g" \
    -e "s/\${MYSQL_PASSWORD}/$MYSQL_PASSWORD/g" \
    /docker-entrypoint-initdb.d/init.sql.template > /docker-entrypoint-initdb.d/init.sql

/usr/local/bin/docker-entrypoint.sh mysqld