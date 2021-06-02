import { AppProps } from "next/app";
import Head from "next/head";
import { Reset } from "styled-reset";

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Mon Jardin</title>

        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat&family=Playfair+Display+SC:wght@700&family=Playfair+Display:wght@400;700&family=Roboto&display=swap"
          rel="stylesheet"
        ></link>
      </Head>

      <Reset />
      <Component {...pageProps} />
    </>
  );
}

export default App;
