# UniWebPlatform - Next.js

## Run

```bash
npm run dev
```

## Configuration changes made after `create-next-app`

### Jest

[https://nextjs.org/docs/app/building-your-application/testing/jest](https://nextjs.org/docs/app/building-your-application/testing/jest)

#### jest.config.js

```ts
import type { Config } from 'jest'
import nextJest from 'next/jest.js'
 
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})
 
// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}
 
// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config)
```

#### package.json

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

### next.config.mjs

From:

```js
const nextConfig = {};
```

To:

```js
const nextConfig = {
  output: 'standalone',
};
```

## Update public resources

Download

`node_modules/highlight.js/styles/github.css`
`node_modules/highlight.js/styles/github-dark.css`

to

`public/css/highlight/github.css`
`public/css/highlight/github-dark.css`
.

Download
`node_modules/github-markdown-css/github-markdown.css`
`node_modules/github-markdown-css/github-markdown-light.css`
`node_modules/github-markdown-css/github-markdown-dark.css`

to

`public/css/markdown/github-markdown.css`
`public/css/markdown/github-markdown-light.css`
`public/css/markdown/github-markdown-dark.css`
.
