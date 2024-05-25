# UniWebPlatform - Next.js

## Run

```bash
npm run dev
```

## Configuration changes made after create-next-app

### tailwind.config.ts

From:

```ts
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
};
```

To:

```ts
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
};
```

### tsconfig.json

From:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

To:

```json
{
  "compilerOptions": {
    "target": "es6",
    "paths": {
      "@/*": ["./*"]
    }
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