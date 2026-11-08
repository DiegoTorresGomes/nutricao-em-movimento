import { nutritionistConfig } from "@/config/nutritionist";
import { renderBlocksToHtml } from "./render-blocks-to-html";
import type { EditorBlock } from "./blocks";
import { analyzeHtmlContent } from "@/components/editor/analyze-html-content";

export type ValidationItem = {
  label: string;
  ok: boolean;
  required: boolean;
  message?: string;
};

export type ValidationGroup = {
  title: string;
  score: number;
  items: ValidationItem[];
};

export type ValidatePostInput = {
  authorId?: string | null;
  title?: string | null;
  description?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  focusKeyword?: string | null;
  categoryId?: string | null;
  categoryName?: string | null;
  coverImage?: string | null;
  coverImageAlt?: string | null;
  status?: string | null;
  scheduledAt?: Date | string | null;
  mobileReviewed?: boolean | null;
  tabletReviewed?: boolean | null;
  desktopReviewed?: boolean | null;
  blocks: EditorBlock[];
  hasOtherPublishedPosts?: boolean;
  content?: string | null;
  useLegacyHtml?: boolean;
};

export function validatePostBeforePublish(input: ValidatePostInput) {
  const blocks = input.blocks || [];

  const htmlAnalysis = input.useLegacyHtml
    ? analyzeHtmlContent(input.content || "")
    : null;

  const hasH2 = input.useLegacyHtml
    ? !!htmlAnalysis?.hasH2
    : blocks.some((block) => block.type === "heading" && block.data.level === 2);

  const hasParagraph = input.useLegacyHtml
    ? !!htmlAnalysis?.hasParagraph
    : blocks.some((block) => block.type === "paragraph" && String(block.data.text || "").trim());

  // The public template renders this same name, credential and profile link.
  // A word in the body is not proof of authorship.
  const hasCanonicalAuthor =
    nutritionistConfig.publishingAccountIds.includes(input.authorId || "") &&
    hasText(nutritionistConfig.displayName) &&
    /^CRN\s+\d+$/.test(nutritionistConfig.credential) &&
    nutritionistConfig.authorPath === "/pt/autora/weverlyn-alves";

  const hasCta = input.useLegacyHtml
    ? !!htmlAnalysis?.hasCta
    : analyzeHtmlContent(renderBlocksToHtml(blocks)).hasCta;

  const hasRelatedArticle = input.useLegacyHtml
    ? !!htmlAnalysis?.hasRelatedArticle
    : blocks.some((block) => block.type === "relatedArticle");

  const hasFaq = input.useLegacyHtml
    ? !!htmlAnalysis?.hasFaq
    : blocks.some((block) => block.type === "faq");
  const hasComparisonCard = !!htmlAnalysis?.hasResponsiveCard || blocks.some((block) => block.type === "comparisonCard");
  const hasTable = !!htmlAnalysis?.hasTable || blocks.some((block) => block.type === "table");

  const imageBlocks = blocks.filter((block) => block.type === "image");

  const imagesHaveAlt = input.useLegacyHtml
    ? !!htmlAnalysis?.imagesHaveAlt
    : imageBlocks.every((block) => String(block.data.alt || "").trim());

  const content: ValidationItem[] = [
    {
      label: "Título do artigo",
      ok: hasText(input.title),
      required: true,
      message: "Preencha o título principal do artigo.",
    },
    {
      label: "Categoria",
      ok: hasText(input.categoryId) || hasText(input.categoryName),
      required: true,
      message: "Selecione a categoria editorial.",
    },
    {
      label: "Descrição/resumo",
      ok: hasText(input.description),
      required: true,
      message: "Preencha a descrição que aparece no card e no Google.",
    },
    {
      label: "Pelo menos 1 H2",
      ok: hasH2,
      required: true,
      message: "Inclua ao menos um bloco de Título H2.",
    },
    {
      label: "Pelo menos 1 parágrafo",
      ok: hasParagraph,
      required: true,
      message: "Inclua ao menos um bloco de parágrafo.",
    },
    {
      label: "Autoria canônica no template",
      ok: hasCanonicalAuthor,
      required: true,
      message: "Vincule a autora canônica com nome, CRN e perfil disponíveis no template público.",
    },
  ];

  const seo: ValidationItem[] = [
    {
      label: "SEO Title",
      ok: hasText(input.seoTitle),
      required: true,
      message: "Preencha o meta title.",
    },
    {
      label: "SEO Description",
      ok: hasText(input.seoDescription),
      required: true,
      message: "Preencha a meta description.",
    },
    {
      label: "Palavra-chave principal",
      ok: hasText(input.focusKeyword),
      required: false,
      message: "Anotação interna opcional para orientar a intenção editorial; não gera meta keywords nem exige repetição no texto.",
    },
    {
      label: "Alt da capa",
      ok: hasText(input.coverImageAlt),
      required: true,
      message: "Preencha o texto alternativo da imagem de capa.",
    },
    {
      label: "Alt das imagens internas",
      ok: imagesHaveAlt,
      required: true,
      message: "Todas as imagens internas precisam de texto alternativo.",
    },
    {
      label: "Link interno",
      ok: !input.hasOtherPublishedPosts || hasRelatedArticle,
      required: false,
      message: "Inclua um link para artigo relacionado.",
    },
    {
      label: "FAQ",
      ok: hasFaq,
      required: false,
      message: "Recomendado para conteúdos educativos.",
    },
  ];

  const growth: ValidationItem[] = [
    {
      label: "CTA editorial",
      ok: hasCta,
      required: false,
      message: "Avalie uma próxima ação pertinente (artigo, contato, newsletter ou consulta). A ausência justificada não impede publicação.",
    },
    {
      label: "Artigo relacionado",
      ok: !input.hasOtherPublishedPosts || hasRelatedArticle,
      required: false,
      message: "Inclua o bloco Leia Também para aumentar engajamento.",
    },

  ];

  const quality: ValidationItem[] = [
    {
      label: "Preview Desktop revisado",
      ok: Boolean(input.desktopReviewed),
      required: true,
      message: "Revise o preview desktop antes de publicar.",
    },
    {
      label: "Preview Tablet revisado",
      ok: Boolean(input.tabletReviewed),
      required: true,
      message: "Revise o preview tablet antes de publicar.",
    },
    {
      label: "Preview Mobile revisado",
      ok: Boolean(input.mobileReviewed),
      required: true,
      message: "Revise o preview mobile antes de publicar.",
    },
    {
      label: "Tabelas responsivas",
      ok: !hasTable || Boolean(input.desktopReviewed && input.tabletReviewed && input.mobileReviewed),
      required: false,
      message: "Confira tabelas nas três revisões visuais; a estrutura não comprova responsividade.",
    },
    {
      label: "Cards responsivos",
      ok: !hasComparisonCard || Boolean(input.desktopReviewed && input.tabletReviewed && input.mobileReviewed),
      required: false,
      message: "Confira os cards nas três revisões visuais.",
    },
  ];

  const groups: ValidationGroup[] = [
    buildGroup("Requisitos estruturais", content),
    buildGroup("SEO", seo),
    buildGroup("Recomendações editoriais", growth),
    buildGroup("Revisão visual manual", quality),
  ];

  const allItems = groups.flatMap((group) => group.items);
  const requiredItems = allItems.filter((item) => item.required);
  const missingRequired = requiredItems.filter((item) => !item.ok).map((item) => item.label);

  const overallScore = calculateScore(allItems.map((item) => item.ok));
  const canPublish = missingRequired.length === 0;

  return {
    canPublish,
    overallScore,
    missingRequired,
    groups,
  };
}

function buildGroup(title: string, items: ValidationItem[]): ValidationGroup {
  return {
    title,
    items,
    score: calculateScore(items.map((item) => item.ok)),
  };
}

function calculateScore(items: boolean[]) {
  if (items.length === 0) return 0;

  const valid = items.filter(Boolean).length;

  return Math.round((valid / items.length) * 100);
}

function hasText(value: unknown) {
  return String(value || "").trim().length > 0;
}
