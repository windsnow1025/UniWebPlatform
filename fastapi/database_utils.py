import os
import mysql.connector
from mysql.connector import Error


mysql_user = os.getenv('MYSQL_USER')
mysql_password = os.getenv('MYSQL_PASSWORD')
mysql_database = os.getenv('MYSQL_DATABASE')
mysql_host = 'mysql'


def create_connection():
    try:
        connection = mysql.connector.connect(
            host=mysql_host,
            user=mysql_user,
            password=mysql_password,
            database=mysql_database
        )
        print("Successfully connected to the database.")
        return connection
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return None


def select_credit(username, connection):
    try:
        cursor = connection.cursor()
        query = "SELECT credit FROM user WHERE username = %s"
        cursor.execute(query, (username,))
        result = cursor.fetchone()
        cursor.close()
        if result is None:
            return None
        else:
            return result[0]
    except Error as e:
        print(f"Error: {e}")
        return False


def update_credit(username, credit, connection):
    try:
        cursor = connection.cursor()
        query = "UPDATE user SET credit = %s WHERE username = %s"
        cursor.execute(query, (credit, username))
        connection.commit()
        cursor.close()
        return True
    except Error as e:
        print(f"Error: {e}")
        return False