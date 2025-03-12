# Nest.js

## Setup

Copy `./env.example` and rename it to `.env`, then fill in the environment variables.

## Requirements

```bash
  npm i -g @nestjs/cli @openapitools/openapi-generator-cli
```

## OpenAPI

Docs: `/api`

### Client Package

1. Download OpenAPI JSON
    ```bash
    curl -o openapi.json http://localhost:3001/api-json
    ```

2. Generate the Client SDK

    - For Axios:
        ```sh
        openapi-generator-cli generate -i openapi.json -g typescript-axios -o client
        ```

    - For Fetch API:
        ```sh
        openapi-generator-cli generate -i openapi.json -g typescript-fetch -o client
        ```

    - For Angular:
        ```sh
        openapi-generator-cli generate -i openapi.json -g typescript-angular -o client
        ```

## Run

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Nest.js init

```bash
nest new <project-name>
```

## Configuration changes made after `nest new <project-name>`

### package.json

From:

```json
{
  "scripts": {
    "start:prod": "node dist/main"
  }
}
```

To:

```json
{
  "scripts": {
    "start:prod": "node dist/src/main"
  }
}
```

### .prettierrc

Add:

```ts
module.exports = {
  rules: {
    "prettier/prettier": [
      "error",
      {
        "endOfLine": "auto"
      }
    ]
  },
};
```

### tsconfig.json

From:

```json
{
  "compilerOptions": {
    "strictNullChecks": false,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false
  }
}
```

To:

```json
{
  "compilerOptions": {
    "strictNullChecks": true,
    "noImplicitAny": true,
    "strictBindCallApply": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

## Run a single typescript file

```bash
npx ts-node <filepath>
```
