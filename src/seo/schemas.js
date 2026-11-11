import { PLANS } from '../utils/format.js'
import { SITE, absoluteUrl } from './site.js'

const organizationRef = { '@type': 'Organization', name: SITE.name, url: absoluteUrl('/') }

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: absoluteUrl('/'),
    description: SITE.defaultDescription,
    inLanguage: SITE.language
  }
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: absoluteUrl('/'),
    logo: SITE.logo,
    description: SITE.defaultDescription
  }
}

export function faqSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a }
    }))
  }
}

export function pricingSchemas() {
  return PLANS.map((plan) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${SITE.name} ${plan.name}`,
    description: `${SITE.name} ${plan.name} plan: $${plan.price} per ${plan.period}. Includes check-ins, the encrypted journal, all guided exercises, Insights and the AI companion.`,
    brand: organizationRef,
    image: SITE.logo,
    offers: {
      '@type': 'Offer',
      price: String(plan.price),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: absoluteUrl('/pricing'),
      seller: organizationRef
    }
  }))
}
