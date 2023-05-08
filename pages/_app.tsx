import NavBar from '@/components/NavBar';
import { wrapper } from '@/store';
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

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  return (
    <>
      {router.pathname!=="/" && NavBar(router.pathname)}
      <Component {...pageProps}/>
    </>
  );
}

export default wrapper.withRedux(App);