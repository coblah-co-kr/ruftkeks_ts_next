import NavBar from '@/components/NavBar';
import { wrapper } from '@/store';
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

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
  const [isMobile, setIsMobile] = useState(false);

  function handleResize() {
    setIsMobile(window.innerWidth<768);
  }

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);
  return (
    <>
      {router.pathname==="/financial"?(
        <div>
          {isMobile?(
            <div className={'max-w-[48rem] mx-auto bg-white dark:bg-black h-screen'.concat((isMobile)?" w-fit":"")}>
              {NavBar(router.pathname)}
              <div className='text-center hansans text-xl h-96 py-48 dark:text-white'>
                회비내역은 모바일에서 지원하지 않습니다.
              </div>
            </div>
          ):(
            <div className={'max-w-[96rem] mx-auto bg-white dark:bg-black h-screen'.concat((isMobile)?" w-fit":"")}>
              {NavBar(router.pathname)}
              <Component {...pageProps}/>
            </div>
          )}
        </div>
      ):
      router.pathname==="/"? (
        <div className={'max-w-[96rem] mx-auto bg-white dark:bg-black h-screen'.concat((isMobile)?" w-fit":"")}>
          <Component {...pageProps}/>
        </div>
      ):
      (
        <div className={'max-w-[48rem] mx-auto bg-white dark:bg-black h-screen'.concat((isMobile)?" w-fit":"")}>
          {router.pathname!=="/" && NavBar(router.pathname)}
          <Component {...pageProps}/>
        </div>
      )}
    </>
    
    
  );
}

export default wrapper.withRedux(App);