import os
import json
import logging


def detect_environment_variables(environment_variables: list[str]):
    return all(os.getenv(var) is not None for var in environment_variables)


def set_environment_from_config(filepath: str):
    with open(filepath) as config_file:
        config = json.load(config_file)
        for key, value in config.items():
            os.environ[key] = value


def init_environment():
    environment_variables = [
        "OPENAI_API_KEY",
        "AZURE_API_KEY",
        "AZURE_API_BASE",
        "JWT_SECRET",
        "MYSQL_ROOT_PASSWORD",
        "MYSQL_USER",
        "MYSQL_PASSWORD",
        "MYSQL_DATABASE"
    ]

    if detect_environment_variables(environment_variables):
        os.environ["MYSQL_HOST"] = "mysql"

        logging.info("Using environment variables for production.")
    else:
        os.environ["MYSQL_HOST"] = "localhost"
        set_environment_from_config(os.path.join(os.path.dirname(os.path.abspath(__file__)), "config.json"))

        logging.info("Using config.json for development.")
