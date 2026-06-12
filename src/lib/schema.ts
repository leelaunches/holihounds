import { SITE_NAME, SITE_URL, AUTHOR } from './site';

/**
 * JSON-LD generators. Pages render the result via:
 *   <script type="application/ld+json" set:html={JSON.stringify(obj)} />
 */

export function breadcrumbList(items: { name: string; url?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      // Only emit `item` (URL) for live routes — schema.org allows breadcrumb
      // entries without a URL when the page doesn't exist yet.
      ...(item.url ? { item: new URL(item.url, SITE_URL).toString() } : {}),
    })),
  };
}

export function faqPage(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };
}

type AddressOpts = { locality?: string; region?: string; country?: string };

function postalAddress(addr: AddressOpts | undefined) {
  return {
    '@type': 'PostalAddress',
    addressLocality: addr?.locality,
    addressRegion: addr?.region,
    addressCountry: addr?.country ?? 'GB',
  };
}

export function lodgingBusiness(opts: {
  name: string;
  description: string;
  image: string;
  address?: AddressOpts;
  url?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: opts.name,
    description: opts.description,
    image: opts.image,
    petsAllowed: true,
    address: postalAddress(opts.address),
    url: opts.url,
  };
}

export function barOrPub(opts: {
  name: string;
  description: string;
  image: string;
  address?: AddressOpts;
  url?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BarOrPub',
    name: opts.name,
    description: opts.description,
    image: opts.image,
    petsAllowed: true,
    address: postalAddress(opts.address),
    url: opts.url,
  };
}

export function restaurant(opts: {
  name: string;
  description: string;
  image: string;
  address?: AddressOpts;
  url?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: opts.name,
    description: opts.description,
    image: opts.image,
    petsAllowed: true,
    address: postalAddress(opts.address),
    url: opts.url,
  };
}

export function place(opts: { name: string; description: string; image?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: opts.name,
    description: opts.description,
    image: opts.image,
  };
}

export function itemList(items: { name: string; url?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: item.url ? new URL(item.url, SITE_URL).toString() : undefined,
    })),
  };
}

type AuthorRef = {
  name: string;
  description?: string | null;
  url: string;
  image?: string | null;
};

export function article(opts: {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  url: string;
  /** Defaults to the site-wide AUTHOR. Override only for guest bylines. */
  author?: AuthorRef;
}) {
  const author = opts.author ?? AUTHOR;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.headline,
    description: opts.description,
    image: opts.image,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    mainEntityOfPage: new URL(opts.url, SITE_URL).toString(),
    author: {
      '@type': 'Person',
      name: author.name,
      ...(author.description ? { description: author.description } : {}),
      url: new URL(author.url, SITE_URL).toString(),
      ...(author.image ? { image: new URL(author.image, SITE_URL).toString() } : {}),
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}
