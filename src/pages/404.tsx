//third-party import
import Link from "next/link";
import Head from "next/head";

/**
 * 404 page for any irregular request
 */
export default function NotFoundPage() {
    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <title>Uh Oh!</title>
                <meta name="description" content="404 Error" />
                <link rel="icon" href="/favicon.ico"></link>
            </Head>
            <div className="text-[#fc5c3e] text-center mt-32">
                <h1 className="text-3xl my-10">Ooops... Sorry!</h1>
                <h2 className="text-2xl">
          The page you are looking for that does not exist.
                </h2>
                <Link href="/">
                    <button className="bg-[#fc5c3e] text-white text-lg  rounded-lg py-2 px-3 my-10">
            Back to Home
                    </button>
                </Link>
            </div>
        </>
    );
}
