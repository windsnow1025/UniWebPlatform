import os
import re
from typing import List

from chat import Message, get_file_type


def convert_message_file_url(messages: List[Message]):
    for message in messages:
        for file in message.files:
            if get_file_type(file) == "image":
                continue
            replace_url(file)


def replace_url(url):
    new_url = re.sub(
        r'https?://[^/]+',
        f'http://{os.environ["MINIO_HOST"]}',
        url
    )
    return new_url