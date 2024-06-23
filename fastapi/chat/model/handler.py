from typing import Generator, Callable

from fastapi.responses import StreamingResponse

ChunkGenerator = Generator[str, None, None]
NonStreamResponseHandler = Callable[
    [str],
    str
]
StreamResponseHandler = Callable[
    [Callable[[], ChunkGenerator]],
    StreamingResponse
]
