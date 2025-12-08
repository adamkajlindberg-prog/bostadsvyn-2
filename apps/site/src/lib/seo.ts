import type { Metadata } from "next";

// Base metadata for the site
export const siteConfig = {
  name: "Bostadsvyn",
  url: "https://bostadsvyn.se",
  description:
    "Hitta din drömbostad med AI-drivna verktyg, avancerad sökning och expertråd. Sveriges mest innovativa fastighetsplattform för köpare, säljare och mäklare.",
  keywords:
    "fastigheter, bostäder, köpa bostad, sälja bostad, mäklare, lägenheter, villor, Stockholm, Göteborg, Malmö, AI fastigheter",
  author: "Bostadsvyn Sverige AB",
  themeColor: "#2563eb",
  locale: "sv_SE",
  ogImage: "/og-image.jpg",
};

interface GenerateMetadataOptions {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

/**
 * Generate page metadata for Next.js
 */
export function generatePageMetadata({
  title,
  description = siteConfig.description,
  keywords = siteConfig.keywords,
  ogTitle,
  ogDescription,
  ogImage = siteConfig.ogImage,
  ogUrl,
  canonicalUrl,
  noIndex = false,
}: GenerateMetadataOptions = {}): Metadata {
  const fullTitle = title
    ? title.includes("Bostadsvyn")
      ? title
      : `${title} | ${siteConfig.name}`
    : `${siteConfig.name} - Sveriges modernaste fastighetsplattform`;

  return {
    title: fullTitle,
    description,
    keywords,
    authors: [{ name: siteConfig.author }],
    robots: noIndex ? "noindex,nofollow" : "index,follow",
    alternates: canonicalUrl
      ? {
          canonical: canonicalUrl,
        }
      : undefined,
    openGraph: {
      type: "website",
      title: ogTitle || fullTitle,
      description: ogDescription || description,
      images: [ogImage],
      url: ogUrl || siteConfig.url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle || fullTitle,
      description: ogDescription || description,
      images: [ogImage],
    },
  };
}

/**
 * Property data type for structured data generation
 */
interface PropertyData {
  id: string;
  title: string;
  description?: string;
  images?: string[];
  price: number;
  address_street?: string;
  address_city?: string;
  address_postal_code?: string;
  latitude?: number;
  longitude?: number;
  living_area?: number;
  rooms?: number;
  year_built?: number;
  features?: string[];
  status?: "FOR_SALE" | "SOLD" | "COMING_SOON";
}

/**
 * Generate structured data for a property listing (JSON-LD)
 */
export function generatePropertyStructuredData(property: PropertyData) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description,
    url: `${siteConfig.url}/annons/${property.id}`,
    image: property.images?.[0] || "",
    price: {
      "@type": "PriceSpecification",
      price: property.price,
      priceCurrency: "SEK",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address_street,
      addressLocality: property.address_city,
      postalCode: property.address_postal_code,
      addressCountry: "SE",
    },
    ...(property.latitude &&
      property.longitude && {
        geo: {
          "@type": "GeoCoordinates",
          latitude: property.latitude,
          longitude: property.longitude,
        },
      }),
    ...(property.living_area && {
      floorSize: {
        "@type": "QuantitativeValue",
        value: property.living_area,
        unitCode: "MTK",
      },
    }),
    numberOfRooms: property.rooms,
    yearBuilt: property.year_built,
    amenityFeature:
      property.features?.map((feature) => ({
        "@type": "LocationFeatureSpecification",
        name: feature,
      })) || [],
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: "SEK",
      availability:
        property.status === "FOR_SALE"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };
}

/**
 * Generate organization structured data (JSON-LD)
 */
export function generateOrganizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.author,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
    address: {
      "@type": "PostalAddress",
      addressCountry: "SE",
    },
    sameAs: [
      "https://www.facebook.com/bostadsvyn",
      "https://www.linkedin.com/company/bostadsvyn",
      "https://twitter.com/bostadsvyn",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "info@bostadsvyn.se",
      contactType: "customer service",
      availableLanguage: "Swedish",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generate website structured data (JSON-LD)
 */
export function generateWebsiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generate breadcrumb structured data (JSON-LD)
 */
export function generateBreadcrumbStructuredData(
  items: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${siteConfig.url}${item.url}`,
    })),
  };
}
