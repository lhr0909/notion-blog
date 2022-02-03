import { useEffect } from "react";
import type { AppProps } from "next/app";
import TagManager from "react-gtm-module";

import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    TagManager.initialize({ gtmId: process.env.NEXT_PUBLIC_GTM_ID! });
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
