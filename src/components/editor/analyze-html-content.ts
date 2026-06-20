export type HtmlContentAnalysis = {
  hasH2: boolean;
  hasParagraph: boolean;
  hasAuthorNote: boolean;
  hasDisclaimer: boolean;
  hasCta: boolean;
  hasRelatedArticle: boolean;
  hasFaq: boolean;
  hasTable: boolean;
  hasResponsiveCard: boolean;
  imagesHaveAlt: boolean;
};

export function analyzeHtmlContent(html: string): HtmlContentAnalysis {
  const normalized = html.toLowerCase();

  const imageTags = html.match(/<img\b[^>]*>/gi) || [];

  const imagesHaveAlt =
    imageTags.length === 0 ||
    imageTags.every((imgTag) => {
      const altMatch = imgTag.match(/\salt=["']([^"']+)["']/i);
      return Boolean(altMatch?.[1]?.trim());
    });

  return {
    hasH2: /<h2\b/i.test(html),
    hasParagraph: /<p\b/i.test(html) && stripHtml(html).trim().length > 80,

    hasAuthorNote:
      normalized.includes("sobre a autora") ||
      normalized.includes("sobre mim") ||
      normalized.includes("nutricionista"),

    hasDisclaimer:
      normalized.includes("caráter educativo") ||
      normalized.includes("carater educativo") ||
      normalized.includes("não substitui") ||
      normalized.includes("nao substitui") ||
      normalized.includes("consulta individualizada"),

    hasCta:
      normalized.includes("newsletter") ||
      normalized.includes("consulta") ||
      normalized.includes("agendar") ||
      normalized.includes("cadastre-se") ||
      normalized.includes("entrar em contato"),

    hasRelatedArticle:
      normalized.includes("leia também") ||
      normalized.includes("leia tambem") ||
      normalized.includes("artigo relacionado") ||
      /<a\b[^>]*href=["']\/pt\/artigos\//i.test(html),

    hasFaq:
      normalized.includes("faq") ||
      normalized.includes("perguntas frequentes") ||
      countOccurrences(html, /<h3\b/gi) >= 5,

    hasTable: /<table\b/i.test(html),

    hasResponsiveCard:
      normalized.includes("border-radius") ||
      normalized.includes("background:#faf8f4") ||
      normalized.includes("background:#fff8ee") ||
      normalized.includes("background:#f5faf3"),

    imagesHaveAlt,
  };
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ");
}

function countOccurrences(text: string, regex: RegExp) {
  return text.match(regex)?.length ?? 0;
}