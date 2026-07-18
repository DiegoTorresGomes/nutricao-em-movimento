const SITE_URL = "https://nutricaoemovimento.com";

type LegalPageSchemaProps = {
  title: string;
  /** Path starting with a slash, e.g. "/pt/politica-de-privacidade". */
  path: string;
  description: string;
};

// Emits WebPage + BreadcrumbList JSON-LD for a static legal page.
export function LegalPageSchema({ title, path, description }: LegalPageSchemaProps) {
  const url = `${SITE_URL}${path}`;

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url,
    inLanguage: "pt-BR",
    isPartOf: {
      "@type": "WebSite",
      name: "Nutrição & Movimento",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Nutrição & Movimento",
      url: SITE_URL,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Início",
        item: `${SITE_URL}/pt`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: title,
        item: url,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
