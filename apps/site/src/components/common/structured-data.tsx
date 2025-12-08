interface StructuredDataProps {
  data: object | object[];
}

/**
 * Component to inject JSON-LD structured data into the page
 * Use this in your page components to add schema.org data
 *
 * @example
 * ```tsx
 * import { generateOrganizationStructuredData } from "@/lib/seo";
 *
 * export default function HomePage() {
 *   return (
 *     <>
 *       <StructuredData data={generateOrganizationStructuredData()} />
 *       <main>...</main>
 *     </>
 *   );
 * }
 * ```
 */
const StructuredData = ({ data }: StructuredDataProps) => {
  const jsonLd = Array.isArray(data) ? data : [data];

  return (
    <>
      {jsonLd.map((item, index) => (
        <script
          key={`structured-data-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item),
          }}
        />
      ))}
    </>
  );
};

export default StructuredData;
