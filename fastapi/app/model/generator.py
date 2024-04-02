from typing import Generator

ChunkGenerator = Generator[str, None, None]

ResponseGenerator = Generator[str, None, tuple[str, float]]
