# Nest.js

## Development

### pnpm

1. Install Node.js
2. Install pnpm: `corepack enable`
3. Install dependencies: `pnpm install`

### Environment Variables

- Copy `./.env.example` and rename it to `.env`, then fill in the Env variables.
- Copy `./firebaseConfig.example.json` and rename it to `./firebaseConfig.json`, then fill in the Env variables.
- Copy `./serviceAccountKey.example.json` and rename it to `./serviceAccountKey.json`, then fill in the Env variables.

### Run

```bash
pnpm run dev
```

## OpenAPI

### Requirements

1. Install openapi-generator-cli globally.
    ```bash
    npm i -g @openapitools/openapi-generator-cli@latest
    ```
2. Install Java.
3. Install Python.
4. Install openapi-python-client.
    ```bash
    pip install --upgrade openapi-python-client
    ```

### Generate Client Package

- Next.js
  ```bash
  rm -r ../next/client/nest
  ```
  ```bash
  openapi-generator-cli generate -i http://localhost:3001/docs-json -g typescript-axios -o ../next/client/nest
  ```
- FastAPI
  ```bash
  rm -r ../fastapi/app/client
  ```
  ```bash
  openapi-python-client generate --url http://localhost:3001/docs-json --output-path ../fastapi/app/client
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
