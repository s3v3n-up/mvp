import Head from "next/head";

/**
 * props of seo header
 * @property {string} title
 * @property {string} description
 * @property {string} image
 * @property {string} url
 * @property {string} keywors
 */
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
 * @prop {string} title - page title
 * @prop {string} description - page description
 * @prop {string} image - main image of page
 * @prop {string} url - page url
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