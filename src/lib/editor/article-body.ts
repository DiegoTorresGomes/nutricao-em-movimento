const correctedArticle = "relacao-saudavel-com-a-comida-o-que-e-e-como-construi-la-no-dia-a-dia";

// Only official internal anchors: keep paths, fragments, queries and all other hosts intact.
export function normalizeInternalLinks(html: string) {
  return html.replace(/(<a\b[^>]*\bhref\s*=\s*)(["'])(?:https?:)?\/\/(?:www\.)?nutricaoemovimento\.com(?=\/|\2)([^"']*)\2/gi,
    (_match, prefix: string, quote: string, path: string) => `${prefix}${quote}${path || "/"}${quote}`);
}

export function withoutBodyH1(html: string) {
  return html.replace(/<(\/?)(h1)(?=[\s>])/gi, "<$1h2");
}

export function articleBody(html: string, slug?: string) {
  let result = normalizeInternalLinks(html);
  if (slug === correctedArticle) {
    result = withoutBodyH1(result)
      .replace("Se você ainda não leu nosso conteúdo completo sobre esse tema, vale conferir:", "Para aprofundar a diferença entre fome emocional e fome física, vale conferir:")
      .replace("Ler artigo sobre Escala da Fome e Saciedade", "Ler artigo sobre fome emocional e fome física")
      .replace("Escala da Fome e Saciedade: Como Aprender a Ouvir Seu Corpo", "Fome emocional ou fome física? Aprenda a identificar a diferença");
  }
  return result;
}
