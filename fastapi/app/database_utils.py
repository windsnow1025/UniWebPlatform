import os
import mysql.connector
from mysql.connector.pooling import PooledMySQLConnection

dbconfig = {
    "host": "mysql",
    "user": os.getenv('MYSQL_USER'),
    "password": os.getenv('MYSQL_PASSWORD'),
    "database": os.getenv('MYSQL_DATABASE')
}

connection_pool = mysql.connector.pooling.MySQLConnectionPool(**dbconfig)


def get_connection() -> PooledMySQLConnection:
    return connection_pool.get_connection()


def select_credit(username: str) -> float:
    connection = get_connection()
    cursor = connection.cursor()
    query = "SELECT credit FROM user WHERE username = %s"
    cursor.execute(query, (username,))
    result = cursor.fetchone()
    cursor.close()
    connection.close()
    return result[0]


def update_credit(username: str, credit: float) -> bool:
    connection = get_connection()
    cursor = connection.cursor()
    query = "UPDATE user SET credit = %s WHERE username = %s"
    cursor.execute(query, (credit, username))
    connection.commit()
    cursor.close()
    connection.close()
    return True
