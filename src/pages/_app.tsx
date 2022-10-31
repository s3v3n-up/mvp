//third-party import
import type { AppProps } from "next/app";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import Layout from "@/components/layout/Layout";

//local import
import "../styles/globals.sass";

interface PageProps {
    session: Session
}

function MyApp({ Component, pageProps }: AppProps<PageProps>) {
    return (
        <Layout>
            <SessionProvider session={pageProps.session} refetchInterval={1}>
                <Component {...pageProps} />
            </SessionProvider>
        </Layout>
    );
}
export default MyApp;
