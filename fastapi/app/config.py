import logging
import os

from dotenv import load_dotenv


def init_env():
    load_dotenv()
    is_production = os.environ.get('ENV') != 'development'

    logging.info(f"Using {'production' if is_production else 'development'} setting.")
