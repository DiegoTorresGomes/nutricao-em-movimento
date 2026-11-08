// One approved consolidation. Keep source identity for the permanent redirect
// even after its database record has been archived.
export const weightConsolidation = {
  sourceId: "cmrl2gz5k00009e2rg5qgjl1h",
  sourceSlug: "emagrecimento-sustentavel-habitos-que-importam-mais-que-forca-de-vontade",
  targetId: "cmqppa7du0000ve2rnn31iyzq",
  targetSlug: "emagrecimento-sustentavel-como-cuidar-do-corpo-com-equilibrio-nutricao-e-movimento",
  origin: "https://www.nutricaoemovimento.com",
} as const;

export const consolidationSourcePath = `/pt/artigos/${weightConsolidation.sourceSlug}`;
export const consolidationTargetPath = `/pt/artigos/${weightConsolidation.targetSlug}`;
export const consolidationTargetUrl = `${weightConsolidation.origin}${consolidationTargetPath}`;

// Preserve metadata behavior for every article outside this consolidation.
export function consolidationDescription(article: { slug: string; description: string; seoDescription: string | null }) {
  return article.slug === weightConsolidation.targetSlug
    ? article.seoDescription?.trim() || article.description
    : article.description;
}
