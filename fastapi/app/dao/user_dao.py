from app.util.db_util import DatabaseConnection


def select_credit(username: str) -> float:
    database_connection = DatabaseConnection.get_instance()
    connection = database_connection.get_connection()
    cursor = connection.cursor()
    query = "SELECT credit FROM user WHERE username = %s"
    cursor.execute(query, (username,))
    result = cursor.fetchone()
    cursor.close()
    connection.close()
    return result[0]


def update_credit(username: str, credit: float) -> bool:
    database_connection = DatabaseConnection.get_instance()
    connection = database_connection.get_connection()
    cursor = connection.cursor()
    query = "UPDATE user SET credit = %s WHERE username = %s"
    cursor.execute(query, (credit, username))
    connection.commit()
    cursor.close()
    connection.close()
    return True
