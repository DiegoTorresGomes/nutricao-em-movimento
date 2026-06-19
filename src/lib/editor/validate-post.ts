import type { EditorBlock } from "./blocks";

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

type ValidatePostInput = {
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
};

export function validatePostBeforePublish(input: ValidatePostInput) {
  const blocks = input.blocks || [];

  const hasH2 = blocks.some(
    (block) =>
      block.type === "heading" && Number(block.data.level) === 2 && hasText(block.data.text)
  );

  const hasParagraph = blocks.some(
    (block) => block.type === "paragraph" && hasText(block.data.text)
  );

  const hasAuthorNote = blocks.some((block) => block.type === "authorNote");
  const hasDisclaimer = blocks.some((block) => block.type === "disclaimer");
  const hasCta = blocks.some((block) => block.type === "cta");
  const hasRelatedArticle = blocks.some((block) => block.type === "relatedArticle");
  const hasFaq = blocks.some((block) => block.type === "faq");
  const hasComparisonCard = blocks.some((block) => block.type === "comparisonCard");
  const hasTable = blocks.some((block) => block.type === "table");

  const imageBlocks = blocks.filter((block) => block.type === "image");

  const allInternalImagesHaveAlt =
    imageBlocks.length === 0 || imageBlocks.every((block) => hasText(block.data.alt));

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
      label: "Sobre a autora",
      ok: hasAuthorNote,
      required: true,
      message: "Inclua o bloco Sobre a autora.",
    },
    {
      label: "Disclaimer/aviso educativo",
      ok: hasDisclaimer,
      required: true,
      message: "Inclua o disclaimer/aviso educativo.",
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
      required: true,
      message: "Informe a palavra-chave principal.",
    },
    {
      label: "Alt da capa",
      ok: hasText(input.coverImageAlt),
      required: true,
      message: "Preencha o texto alternativo da imagem de capa.",
    },
    {
      label: "Alt das imagens internas",
      ok: allInternalImagesHaveAlt,
      required: true,
      message: "Todas as imagens internas precisam de texto alternativo.",
    },
    {
      label: "Link interno",
      ok: !input.hasOtherPublishedPosts || hasRelatedArticle,
      required: Boolean(input.hasOtherPublishedPosts),
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
      label: "CTA newsletter ou consulta",
      ok: hasCta,
      required: true,
      message: "Inclua um CTA para newsletter, consulta ou próxima ação.",
    },
    {
      label: "Artigo relacionado",
      ok: !input.hasOtherPublishedPosts || hasRelatedArticle,
      required: Boolean(input.hasOtherPublishedPosts),
      message: "Inclua o bloco Leia Também para aumentar engajamento.",
    },
    {
      label: "Categoria editorial",
      ok: hasText(input.categoryId) || hasText(input.categoryName),
      required: true,
      message: "Selecione uma categoria editorial.",
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
      ok: !hasTable || true,
      required: false,
      message: "Tabelas são renderizadas com rolagem horizontal.",
    },
    {
      label: "Cards responsivos",
      ok: !hasComparisonCard || true,
      required: false,
      message: "Cards comparativos são renderizados em layout responsivo.",
    },
  ];

  const groups: ValidationGroup[] = [
    buildGroup("Conteúdo", content),
    buildGroup("SEO", seo),
    buildGroup("Crescimento", growth),
    buildGroup("Qualidade visual", quality),
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
