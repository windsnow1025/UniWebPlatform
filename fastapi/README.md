# FastAPI

## Setup

### Environment

1. Copy `./.env.example` and rename it to `./.env`, then fill in the environment variables.
2. Install dependencies:
    ```
    pip install -r requirements.txt
    ```

### Run

In Pycharm Professional:

1. Add new configuration -> FastAPI
2. Set Application file to `./fastapi/app/main.py`

## OpenAPI

### Requirements

1. Install openapi-generator-cli globally.

    ```bash
    npm i -g @openapitools/openapi-generator-cli
    ```

2. Install Java.

### Generate Client Package

```bash
openapi-generator-cli generate -i http://localhost:8000/openapi.json -g typescript-axios -o ../next/client/fastapi
```
