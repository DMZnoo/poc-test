import "../styles/globals.css";
import "windi.css";
import type { AppProps } from "next/app";
import useApp, { AppContext } from "../hooks/useApp";

function MyApp({ Component, pageProps }: AppProps) {
  const context = useApp();
  return (
    <AppContext.Provider value={context}>
      <Component {...pageProps} />
    </AppContext.Provider>
  );
}

export default MyApp;
