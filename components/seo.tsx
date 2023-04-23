import Head from "next/head";

interface SeoObjects {
    subtitle : string
}

export default function Seo({ subtitle } : SeoObjects ) {
    const fullTitle = subtitle
    ? `결사단 | ${subtitle}`
    : "결사단";
    return (
        <Head>
            <title>{fullTitle}</title>
        </Head>
    );
}