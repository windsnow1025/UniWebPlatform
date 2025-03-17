# Next.js

## Run

```bash
npm run dev
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
