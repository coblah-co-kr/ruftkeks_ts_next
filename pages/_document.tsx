import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
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
