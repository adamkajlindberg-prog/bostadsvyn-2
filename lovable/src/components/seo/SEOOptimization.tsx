import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOOptimizationProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  structuredData?: object;
  canonicalUrl?: string;
  noIndex?: boolean;
}

export default function SEOOptimization({
  title = 'Bostadsvyn - Sveriges modernaste fastighetsplattform',
  description = 'Hitta din drömbostad med AI-drivna verktyg, avancerad sökning och expertråd. Sveriges mest innovativa fastighetsplattform för köpare, säljare och mäklare.',
  keywords = 'fastigheter, bostäder, köpa bostad, sälja bostad, mäklare, lägenheter, villor, Stockholm, Göteborg, Malmö, AI fastigheter',
  ogTitle,
  ogDescription,
  ogImage = '/og-image.jpg',
  ogUrl = 'https://bostadsvyn.se',
  structuredData,
  canonicalUrl,
  noIndex = false,
}: SEOOptimizationProps) {
  const fullTitle = title.includes('Bostadsvyn') ? title : `${title} | Bostadsvyn`;
  const fullOgTitle = ogTitle || fullTitle;
  const fullOgDescription = ogDescription || description;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Bostadsvyn" />
      <meta name="robots" content={noIndex ? 'noindex,nofollow' : 'index,follow'} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullOgTitle} />
      <meta property="og:description" content={fullOgDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:site_name" content="Bostadsvyn" />
      <meta property="og:locale" content="sv_SE" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullOgTitle} />
      <meta name="twitter:description" content={fullOgDescription} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#2563eb" />
      <meta name="msapplication-TileColor" content="#2563eb" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://api.mapbox.com" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="https://evgzebvzrihsqfqhmwxo.supabase.co" />
      <link rel="dns-prefetch" href="https://api.openai.com" />
    </Helmet>
  );
}

// Utility function to generate structured data for properties
export const generatePropertyStructuredData = (property: any) => {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.title,
    "description": property.description,
    "url": `https://bostadsvyn.se/annons/${property.id}`,
    "image": property.images?.[0] || '',
    "price": {
      "@type": "PriceSpecification",
      "price": property.price,
      "priceCurrency": "SEK"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": property.address_street,
      "addressLocality": property.address_city,
      "postalCode": property.address_postal_code,
      "addressCountry": "SE"
    },
    "geo": property.latitude && property.longitude ? {
      "@type": "GeoCoordinates",
      "latitude": property.latitude,
      "longitude": property.longitude
    } : undefined,
    "floorSize": property.living_area ? {
      "@type": "QuantitativeValue",
      "value": property.living_area,
      "unitCode": "MTK"
    } : undefined,
    "numberOfRooms": property.rooms,
    "yearBuilt": property.year_built,
    "amenityFeature": property.features?.map((feature: string) => ({
      "@type": "LocationFeatureSpecification",
      "name": feature
    })) || [],
    "offers": {
      "@type": "Offer",
      "price": property.price,
      "priceCurrency": "SEK",
      "availability": property.status === 'FOR_SALE' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
    }
  };
};

// Utility function to generate organization structured data
export const generateOrganizationStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Bostadsvyn Sverige AB",
    "url": "https://bostadsvyn.se",
    "logo": "https://bostadsvyn.se/assets/house-b-logo-v171.png",
    "description": "Sveriges modernaste fastighetsplattform med AI-drivna verktyg för köpare, säljare och mäklare.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "SE"
    },
    "sameAs": [
      "https://www.facebook.com/bostadsvyn",
      "https://www.linkedin.com/company/bostadsvyn",
      "https://twitter.com/bostadsvyn"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+46-8-123-456-78",
      "contactType": "customer service",
      "availableLanguage": "Swedish"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://bostadsvyn.se/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };
};