from app.util.db_connection import DatabaseConnection


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


def reduce_credit(username: str, cost: float) -> bool:
    database_connection = DatabaseConnection.get_instance()
    connection = database_connection.get_connection()
    cursor = connection.cursor()
    query = "UPDATE user SET credit = credit - %s WHERE username = %s"
    cursor.execute(query, (cost, username))
    connection.commit()
    cursor.close()
    connection.close()
    return True
