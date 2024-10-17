import os

from sqlmodel import create_engine, Session


class DatabaseConnection:
    _instance = None

    def __init__(self):
        db_url = f"mysql+mysqlconnector://{os.getenv('MYSQL_USER')}:{os.getenv('MYSQL_PASSWORD')}@{os.getenv('MYSQL_HOST')}/{os.getenv('MYSQL_DATABASE')}"
        self.engine = create_engine(db_url, echo=True)

    @staticmethod
    def get_instance():
        if DatabaseConnection._instance is None:
            DatabaseConnection._instance = DatabaseConnection()
        return DatabaseConnection._instance

    def get_session(self) -> Session:
        return Session(self.engine)
