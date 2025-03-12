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

## Update public resources

1.
    Download

    `node_modules/highlight.js/styles/github.css`

    `node_modules/highlight.js/styles/github-dark.css`
    
    to
    
    `public/css/highlight/github.css`

    `public/css/highlight/github-dark.css`

2.
    Download

    `node_modules/github-markdown-css/github-markdown.css`

    `node_modules/github-markdown-css/github-markdown-light.css`

    `node_modules/github-markdown-css/github-markdown-dark.css`
    
    to
    
    `public/css/markdown/github-markdown.css`

    `public/css/markdown/github-markdown-light.css`

    `public/css/markdown/github-markdown-dark.css`
