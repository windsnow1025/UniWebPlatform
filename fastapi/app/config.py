import logging
import os

from dotenv import load_dotenv


def init_env():
    load_dotenv()
    is_production = os.environ.get('ENV') != 'development'

    if is_production:
        nest_host = os.environ.get('NEST_HOST')
        os.environ['NEST_API_BASE_URL'] = f'http://{nest_host}:3000'
    else:
        os.environ['NEST_API_BASE_URL'] = os.environ.get('NEST_API_BASE_URL') or 'http://localhost:3001'
        os.environ['FASTAPI_PATH_PREFIX'] = ""

    logging.info(f"Using {'production' if is_production else 'development'} setting.")
