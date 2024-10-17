import logging
import os
from typing import Annotated

from fastapi import Depends
from sqlmodel import create_engine, Session


def get_session():
    db_url = f"mysql+mysqlconnector://{os.getenv('MYSQL_USER')}:{os.getenv('MYSQL_PASSWORD')}@{os.getenv('MYSQL_HOST')}/{os.getenv('MYSQL_DATABASE')}"
    engine = create_engine(db_url)

    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]
