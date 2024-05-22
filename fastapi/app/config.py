import os
import logging
from dotenv import load_dotenv


def init_env():
    load_dotenv()
    is_production = os.environ.get('ENV') != 'development'

    os.environ["MYSQL_HOST"] = "mysql" if is_production else "localhost"

    logging.info(f"Using {'production' if is_production else 'development'} setting.")
