FROM mysql:8

COPY custom-entrypoint.sh /custom-entrypoint.sh
COPY init.sql.template /docker-entrypoint-initdb.d/init.sql.template

ENTRYPOINT ["/custom-entrypoint.sh"]

EXPOSE 3306