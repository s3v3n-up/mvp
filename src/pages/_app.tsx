//third-party import
import type { AppProps } from "next/app";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import Layout from "@/components/layout";
import AvatarProvider from "@/context/avatar";

//local import
import "../styles/globals.sass";

interface PageProps {
    session: Session
}

function MyApp({ Component, pageProps }: AppProps<PageProps>) {
    return (
        <SessionProvider session={pageProps.session} refetchInterval={1}>
            <AvatarProvider>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </AvatarProvider>
        </SessionProvider>
    );
}
export default MyApp;
