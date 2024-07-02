# UniWebPlatform - Nest.js

## Nest.js init

```bash
npm i -g @nestjs/cli
```

```bash
nest new <project-name>
```

## Run a single typescript file

```bash
npx ts-node <filepath>
```

## Setup

Copy `./env.example` and rename it to `.env`, then fill in the environment variables.

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

## Configuration changes made after `nest new nest`

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