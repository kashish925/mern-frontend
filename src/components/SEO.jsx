import { Helmet } from 'react-helmet-async'
import { SITE, absoluteUrl } from '../seo/site.js'

function jsonLdText(data) {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

export default function SEO({
  title,
  fullTitle,
  description = SITE.defaultDescription,
  path,
  image = SITE.ogImage,
  imageAlt = SITE.ogImageAlt,
  noindex = false,
  jsonLd
}) {
  const pageTitle = fullTitle || (title ? `${title} | ${SITE.name}` : SITE.defaultTitle)
  const url = path ? absoluteUrl(path) : null
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []

  return (
    <Helmet prioritizeSeoTags>
      <html lang={SITE.language} />
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      {url && !noindex ? <link rel="canonical" href={url} /> : null}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:locale" content={SITE.locale} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      {url ? <meta property="og:url" content={url} /> : null}
      {image ? <meta property="og:image" content={image} /> : null}
      {image ? <meta property="og:image:width" content="1200" /> : null}
      {image ? <meta property="og:image:height" content="630" /> : null}
      {image ? <meta property="og:image:alt" content={imageAlt} /> : null}

      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      {image ? <meta name="twitter:image" content={image} /> : null}
      {SITE.twitterHandle ? <meta name="twitter:creator" content={SITE.twitterHandle} /> : null}

      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {jsonLdText(schema)}
        </script>
      ))}
    </Helmet>
  )
}

export function NoIndex() {
  return (
    <Helmet>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
  )
}
