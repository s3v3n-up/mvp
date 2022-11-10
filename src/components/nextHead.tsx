import Head from "next/head";

interface Props {
    title?: string,
    description?: string,
    keywords?: string,
    image?: string,
    url?: string
}

/**
 * Header components for SEO
 * @returns {JSX.Element} header element
 * @prop title - page title
 * @prop description - page description
 * @prop image - main image of page
 * @prop url - page url
 */
export default function NextHead(props: Props) {
    return (
        <Head>
            <title>{props.title}</title>
            <link rel="icon" href="/img/logo.png" />
            <meta name="description" content={props.description} />
            <meta name="keywords" content={props.keywords} />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#ffff" />
            <meta property="og:title" content={props.title} />
            <meta property="og:description" content={props.description} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={props.url} />
            <meta property="og:image" content={props.image} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@mvp" />
            <meta name="twitter:creator" content="@s3v3nup" />
            <meta name="twitter:title" content={props.title} />
            <meta name="twitter:description" content={props.description} />
            <meta name="twitter:image" content={props.image} />
        </Head>
    );
}