import os
import logging
from dotenv import load_dotenv


def init_env():

    if os.getenv("OPENAI_API_KEY"):
        os.environ["MYSQL_HOST"] = "mysql"

        logging.info("Using production setting.")
    else:
        load_dotenv()
        os.environ["MYSQL_HOST"] = "localhost"

        logging.info("Using development setting.")
