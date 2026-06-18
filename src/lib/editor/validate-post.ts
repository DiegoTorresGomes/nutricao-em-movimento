import type { EditorBlock } from "./blocks";

type ValidatePostInput = {
  title?: string | null;
  slug?: string | null;
  description?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  focusKeyword?: string | null;
  categoryId?: string | null;
  coverImage?: string | null;
  coverImageAlt?: string | null;
  status?: string | null;
  publishedAt?: Date | null;
  scheduledAt?: Date | null;
  mobileReviewed?: boolean | null;
  desktopReviewed?: boolean | null;
  blocks: EditorBlock[];
  hasOtherPublishedPosts?: boolean;
};

export function validatePostBeforePublish(input: ValidatePostInput) {
  const errors: string[] = [];
  const warnings: string[] = [];

  const blocks = input.blocks || [];

  const hasH2 = blocks.some(
    (block) => block.type === "heading" && block.data.level === 2
  );

  const hasParagraph = blocks.some(
    (block) => block.type === "paragraph" && String(block.data.text || "").trim()
  );

  const hasAuthorNote = blocks.some((block) => block.type === "authorNote");
  const hasDisclaimer = blocks.some((block) => block.type === "disclaimer");
  const hasCta = blocks.some((block) => block.type === "cta");
  const hasRelatedArticle = blocks.some((block) => block.type === "relatedArticle");
  const hasFaq = blocks.some((block) => block.type === "faq");

  const imageBlocks = blocks.filter((block) => block.type === "image");

  if (!input.title) errors.push("Título do artigo obrigatório.");
  if (!input.slug) errors.push("Slug obrigatório.");
  if (!input.categoryId) errors.push("Categoria obrigatória.");
  if (!input.description) errors.push("Descrição/resumo obrigatório.");
  if (!input.coverImage) errors.push("Imagem de capa obrigatória.");
  if (!input.coverImageAlt) errors.push("Texto alternativo da capa obrigatório.");

  if (!hasH2) errors.push("Inclua pelo menos 1 título H2 no conteúdo.");
  if (!hasParagraph) errors.push("Inclua pelo menos 1 parágrafo no conteúdo.");
  if (!hasAuthorNote) errors.push("Inclua o bloco Sobre a autora.");
  if (!hasDisclaimer) errors.push("Inclua o disclaimer/aviso educativo.");

  if (!input.seoTitle) errors.push("Meta title obrigatório.");
  if (!input.seoDescription) errors.push("Meta description obrigatória.");
  if (!input.focusKeyword) errors.push("Palavra-chave principal obrigatória.");

  if (!hasCta) errors.push("Inclua pelo menos 1 CTA de newsletter ou consulta.");

  if (input.hasOtherPublishedPosts && !hasRelatedArticle) {
    errors.push("Inclua pelo menos 1 link interno para artigo relacionado.");
  }

  if (imageBlocks.some((block) => !String(block.data.alt || "").trim())) {
    errors.push("Todas as imagens internas precisam de texto alternativo.");
  }

  if (!input.mobileReviewed) {
    warnings.push("Preview mobile ainda não foi revisado.");
  }

  if (!input.desktopReviewed) {
    warnings.push("Preview desktop ainda não foi revisado.");
  }

  if (!hasFaq) {
    warnings.push("O artigo não possui FAQ. Recomendado para conteúdos educativos.");
  }

  if (input.status === "SCHEDULED" && !input.scheduledAt) {
    errors.push("Posts agendados precisam de data e hora de publicação.");
  }

  return {
    canPublish: errors.length === 0,
    errors,
    warnings,
    score: {
      content: calculateScore([
        !!input.title,
        !!input.slug,
        !!input.categoryId,
        !!input.description,
        !!input.coverImage,
        !!input.coverImageAlt,
        hasH2,
        hasParagraph,
        hasAuthorNote,
        hasDisclaimer,
      ]),
      seo: calculateScore([
        !!input.seoTitle,
        !!input.seoDescription,
        !!input.focusKeyword,
        !!input.coverImageAlt,
        imageBlocks.every((block) => String(block.data.alt || "").trim()),
      ]),
      growth: calculateScore([hasCta, !input.hasOtherPublishedPosts || hasRelatedArticle]),
      visual: calculateScore([!!input.mobileReviewed, !!input.desktopReviewed]),
    },
  };
}

function calculateScore(items: boolean[]) {
  if (items.length === 0) return 0;

  const valid = items.filter(Boolean).length;

  return Math.round((valid / items.length) * 100);
}