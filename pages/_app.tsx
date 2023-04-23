import NavBar from '@/components/NavBar';
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router';

declare global {
  interface Window {
      kakao : any;
  }
}

export abstract class User {
  constructor(
      protected name:string,
      protected address:string,
      protected phone:string,
      protected email:string,
  ) {}
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <>
      {router.pathname!=="/" && NavBar(router.pathname)}
      <Component {...pageProps}/>
    </>
  );
}
