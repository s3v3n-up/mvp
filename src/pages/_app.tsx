import "../styles/globals.sass";
import type { AppProps } from "next/app";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

interface PageProps {
    session: Session
}

function MyApp({ Component, pageProps }: AppProps<PageProps>) {
    return (
        <SessionProvider session={pageProps.session} refetchInterval={1}>
            <Component {...pageProps} />
        </SessionProvider>
    );
}
export default MyApp;
