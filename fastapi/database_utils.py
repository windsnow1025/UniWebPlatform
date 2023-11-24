import os
import mysql.connector


mysql_user = os.getenv('MYSQL_USER')
mysql_password = os.getenv('MYSQL_PASSWORD')
mysql_database = os.getenv('MYSQL_DATABASE')


def create_connection() -> mysql.connector.MySQLConnection:
    connection = mysql.connector.connect(
        host='mysql',
        user=mysql_user,
        password=mysql_password,
        database=mysql_database
    )
    print("Successfully connected to the database.")
    return connection


def select_credit(username: str) -> float:
    connection = create_connection()
    cursor = connection.cursor()
    query = "SELECT credit FROM user WHERE username = %s"
    cursor.execute(query, (username,))
    result = cursor.fetchone()
    cursor.close()
    connection.close()
    return result[0]


def update_credit(username: str, credit: float) -> bool:
    connection = create_connection()
    cursor = connection.cursor()
    query = "UPDATE user SET credit = %s WHERE username = %s"
    cursor.execute(query, (credit, username))
    connection.commit()
    cursor.close()
    connection.close()
    return True
