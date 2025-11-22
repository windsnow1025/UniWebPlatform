import logging
import os

from dotenv import load_dotenv


def init_env():
    load_dotenv()
    is_production = os.environ['ENV'] != 'development'

    if is_production:
        os.environ['NEST_API_BASE_URL'] = f'http://{os.environ['NEST_HOST']}:3000'
    else:
        os.environ['NEST_API_BASE_URL'] = os.environ.get('NEST_API_BASE_URL') or 'http://localhost:3001'
        os.environ['FASTAPI_PATH_PREFIX'] = ""

    logging.info(f"Using {'production' if is_production else 'development'} setting.")
