# FastAPI

## Development

### Python uv

1. Install uv: `powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"`
2. Install Python in uv: `uv python install 3.12`; upgrade Python in uv: `uv python install 3.12`
3. Configure requirements:
  ```bash
  uv sync
  ```

### Pycharm Professional

Add New Configuration >> uv run
- Run: Module
- Module: `uvicorn`
- Arguments: `app.main:app --reload --host 127.0.0.1 --port 8000`

### Test

```bash
uv run pytest
```

## OpenAPI

### Requirements

1. Install openapi-generator-cli globally.
  ```bash
  npm i -g @openapitools/openapi-generator-cli@latest
  ```
2. Install Java.

### Generate Client Package

```bash
rm -r ../next/client/fastapi
```
```bash
openapi-generator-cli generate -i http://localhost:8000/openapi.json -g typescript-axios -o ../next/client/fastapi
```
