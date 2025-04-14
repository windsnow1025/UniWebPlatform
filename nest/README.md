# Nest.js

## Setup

Copy `./.env.example` and rename it to `.env`, then fill in the Env variables.

Copy `./firebaseConfig.example.json` and rename it to `./firebaseConfig.json`, then fill in the Env variables.
Copy `./serviceAccountKey.example.json` and rename it to `./serviceAccountKey.json`, then fill in the Env variables.

## Requirements

```bash
npm i -g @nestjs/cli @openapitools/openapi-generator-cli
```

## OpenAPI

Docs: `/api`

### Generate Client Package

```sh
openapi-generator-cli generate -i http://localhost:3001/api-json -g typescript-axios -o ../next/client
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
