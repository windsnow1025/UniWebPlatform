import os
from mysql.connector.pooling import MySQLConnectionPool, PooledMySQLConnection


class DatabaseConnection:
    _instance = None

    def __init__(self):
        dbconfig = {
            "host": os.getenv('MYSQL_HOST'),
            "user": os.getenv('MYSQL_USER'),
            "password": os.getenv('MYSQL_PASSWORD'),
            "database": os.getenv('MYSQL_DATABASE'),
            "auth_plugin": "caching_sha2_password",
        }
        self.connection_pool = MySQLConnectionPool(**dbconfig)

    @staticmethod
    def get_instance():
        if DatabaseConnection._instance is None:
            DatabaseConnection._instance = DatabaseConnection()
        return DatabaseConnection._instance

    def get_connection(self) -> PooledMySQLConnection:
        return self.connection_pool.get_connection()
