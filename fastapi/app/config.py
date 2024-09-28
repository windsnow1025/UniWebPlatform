import logging
import os

from dotenv import load_dotenv


def init_env():
    load_dotenv()
    is_production = os.environ.get('ENV') != 'development'

    os.environ["MYSQL_HOST"] = os.environ.get('MYSQL_HOST')

    logging.info(f"Using {'production' if is_production else 'development'} setting.")
