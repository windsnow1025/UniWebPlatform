# Next.js

## Development

### pnpm

1. Install Node.js
2. Install pnpm (Run as Administrator): `corepack enable`
3. Install dependencies: `pnpm install`

### WebStorm

Settings >> Languages & Frameworks >> JavaScript Runtime >> Package manager: `pnpm`

### Run

```bash
pnpm run dev
```

## Configuration changes made after `create-next-app`

### Jest

[https://nextjs.org/docs/app/building-your-application/testing/jest](https://nextjs.org/docs/app/building-your-application/testing/jest)

### next.config.mjs

From:

```js
const nextConfig = {};
```

To:

```js
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['<package_name>'],
};
```
