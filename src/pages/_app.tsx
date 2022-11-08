//third-party import
import type { AppProps } from "next/app";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

//local import
import "../styles/globals.sass";
import Layout from "@/components/layout";
import AvatarProvider from "@/context/avatar";

interface PageProps {
    session: Session
}

function MyApp({ Component, pageProps }: AppProps<PageProps>) {
    return (
        <SessionProvider session={pageProps.session} refetchOnWindowFocus={false}>
            <AvatarProvider>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </AvatarProvider>
        </SessionProvider>
    );
}
export default MyApp;
