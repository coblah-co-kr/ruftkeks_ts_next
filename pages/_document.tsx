import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/ruftk2.ico" />
      </Head>
      <body className='dark:bg-black'>
        <Main />
        <NextScript />
      </body>
      <style jsx>{`
        body {
          overscroll-behavior: none;
          -webkit-user-select: none;
        }
      `}</style>
    </Html>
  )
}
