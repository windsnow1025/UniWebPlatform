import {Html, Head, Main, NextScript} from 'next/document';

export default function Document() {
  return (
    <Html lang="en" data-mui-color-scheme="light">
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
      </Head>
      <body>
      <Main/>
      <NextScript/>
      </body>
    </Html>
  );
}
