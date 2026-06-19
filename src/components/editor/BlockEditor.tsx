"use client";

import { useMemo, useState } from "react";
import type { EditorBlock, EditorBlockType } from "@/lib/editor/blocks";
import { renderBlocksToHtml } from "@/lib/editor/render-blocks-to-html";

type BlockEditorProps = {
  name?: string;
  initialBlocks?: EditorBlock[];
  previewData?: {
    title?: string;
    description?: string;
    categoryName?: string;
    coverImage?: string;
    readTime?: string;
  };
};

type BlockButton = {
  label: string;
  type: EditorBlockType;
  description: string;
};

const blockButtons: BlockButton[] = [
  {
    label: "Título H2",
    type: "heading",
    description: "Título principal de seção",
  },
  {
    label: "Subtítulo H3",
    type: "heading",
    description: "Subtítulo dentro de uma seção",
  },
  {
    label: "Parágrafo",
    type: "paragraph",
    description: "Texto comum do artigo",
  },
  {
    label: "Lista",
    type: "unorderedList",
    description: "Lista com bolinhas",
  },
  {
    label: "Lista numerada",
    type: "orderedList",
    description: "Passo a passo numerado",
  },
  {
    label: "Resumo rápido",
    type: "summary",
    description: "Box com pontos principais do artigo",
  },
  {
    label: "FAQ",
    type: "faq",
    description: "Perguntas frequentes com respostas",
  },
  {
    label: "Card Comparativo",
    type: "comparisonCard",
    description: "Comparação lado a lado",
  },
  {
    label: "Exercício",
    type: "exercise",
    description: "Passo a passo prático",
  },
  {
    label: "Destaque",
    type: "infoCard",
    description: "Box de destaque ou observação importante",
  },
  {
    label: "Leia também",
    type: "relatedArticle",
    description: "Link estratégico para outro artigo",
  },
  {
    label: "CTA",
    type: "cta",
    description: "Chamada para newsletter, consultas ou ação",
  },
  {
    label: "Imagem",
    type: "image",
    description: "Imagem interna com legenda e texto alternativo",
  },
  {
    label: "Tabela",
    type: "table",
    description: "Tabela responsiva para comparações e dados",
  },
];

function createBlock(type: EditorBlockType, label?: string): EditorBlock {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`;

  if (type === "heading") {
    return {
      id,
      type,
      data: {
        level: label === "Subtítulo H3" ? 3 : 2,
        text: "",
      },
    };
  }

  if (type === "paragraph") {
    return {
      id,
      type,
      data: {
        text: "",
      },
    };
  }

  if (type === "orderedList" || type === "unorderedList") {
    return {
      id,
      type,
      data: {
        items: [""],
      },
    };
  }

  if (type === "summary") {
    return {
      id,
      type,
      data: {
        title: "Resumo rápido",
        items: [""],
      },
    };
  }
  if (type === "faq") {
    return {
      id,
      type,
      data: {
        items: [
          {
            question: "",
            answer: "",
          },
        ],
      },
    };
  }

  if (type === "comparisonCard") {
    return {
      id,
      type,
      data: {
        title: "",
        leftTitle: "Lado A",
        leftItems: [""],
        rightTitle: "Lado B",
        rightItems: [""],
      },
    };
  }

  if (type === "exercise") {
    return {
      id,
      type,
      data: {
        title: "Exercício rápido",
        description: "",
        steps: [""],
      },
    };
  }
  if (type === "infoCard") {
    return {
      id,
      type,
      data: {
        title: "Importante",
        text: "",
      },
    };
  }

  if (type === "relatedArticle") {
    return {
      id,
      type,
      data: {
        title: "Leia também",
        text: "Continue aprendendo com este conteúdo relacionado:",
        linkText: "",
        href: "",
      },
    };
  }
  if (type === "cta") {
    return {
      id,
      type,
      data: {
        title: "Quer receber mais conteúdos como este?",
        text: "Cadastre-se na newsletter para receber orientações educativas sobre alimentação, saúde e comportamento alimentar.",
        buttonText: "Inscreva-se na newsletter",
        href: "/pt#newsletter",
      },
    };
  }

  if (type === "image") {
    return {
      id,
      type,
      data: {
        url: "",
        alt: "",
        caption: "",
      },
    };
  }

  if (type === "table") {
    return {
      id,
      type,
      data: {
        caption: "",
        headers: ["Coluna 1", "Coluna 2"],
        rows: [["", ""]],
      },
    };
  }

  return {
    id,
    type,
    data: {},
  };
}

export function BlockEditor({
  name = "contentBlocks",
  initialBlocks = [],
  previewData,
}: BlockEditorProps) {
  const [blocks, setBlocks] = useState<EditorBlock[]>(initialBlocks);

  const serializedBlocks = useMemo(() => JSON.stringify(blocks), [blocks]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isHomePreviewOpen, setIsHomePreviewOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");

  const previewHtml = useMemo(() => renderBlocksToHtml(blocks), [blocks]);

  function addBlock(type: EditorBlockType, label?: string) {
    setBlocks((currentBlocks) => [...currentBlocks, createBlock(type, label)]);
  }

  function removeBlock(blockId: string) {
    setBlocks((currentBlocks) => currentBlocks.filter((block) => block.id !== blockId));
  }

  function moveBlock(blockId: string, direction: "up" | "down") {
    setBlocks((currentBlocks) => {
      const index = currentBlocks.findIndex((block) => block.id === blockId);

      if (index === -1) return currentBlocks;

      const nextIndex = direction === "up" ? index - 1 : index + 1;

      if (nextIndex < 0 || nextIndex >= currentBlocks.length) {
        return currentBlocks;
      }

      const updatedBlocks = [...currentBlocks];
      const currentBlock = updatedBlocks[index];
      updatedBlocks[index] = updatedBlocks[nextIndex];
      updatedBlocks[nextIndex] = currentBlock;

      return updatedBlocks;
    });
  }

  function updateBlockText(blockId: string, text: string) {
    setBlocks((currentBlocks) =>
      currentBlocks.map((block) => {
        if (block.id !== blockId) return block;

        return {
          ...block,
          data: {
            ...block.data,
            text,
          },
        };
      })
    );
  }

  function updateListItem(blockId: string, itemIndex: number, value: string) {
    setBlocks((currentBlocks) =>
      currentBlocks.map((block) => {
        if (block.id !== blockId) return block;

        const items = Array.isArray(block.data.items) ? [...block.data.items] : [];

        items[itemIndex] = value;

        return {
          ...block,
          data: {
            ...block.data,
            items,
          },
        };
      })
    );
  }

  function addListItem(blockId: string) {
    setBlocks((currentBlocks) =>
      currentBlocks.map((block) => {
        if (block.id !== blockId) return block;

        const items = Array.isArray(block.data.items) ? [...block.data.items] : [];

        return {
          ...block,
          data: {
            ...block.data,
            items: [...items, ""],
          },
        };
      })
    );
  }

  function removeListItem(blockId: string, itemIndex: number) {
    setBlocks((currentBlocks) =>
      currentBlocks.map((block) => {
        if (block.id !== blockId) return block;

        const items = Array.isArray(block.data.items) ? [...block.data.items] : [];

        return {
          ...block,
          data: {
            ...block.data,
            items: items.filter((_, index) => index !== itemIndex),
          },
        };
      })
    );
  }

  function updateSummaryTitle(blockId: string, title: string) {
    setBlocks((currentBlocks) =>
      currentBlocks.map((block) => {
        if (block.id !== blockId) return block;

        return {
          ...block,
          data: {
            ...block.data,
            title,
          },
        };
      })
    );
  }

  function updateSummaryItem(blockId: string, itemIndex: number, value: string) {
    setBlocks((currentBlocks) =>
      currentBlocks.map((block) => {
        if (block.id !== blockId) return block;

        const items = Array.isArray(block.data.items) ? [...block.data.items] : [];

        items[itemIndex] = value;

        return {
          ...block,
          data: {
            ...block.data,
            items,
          },
        };
      })
    );
  }

  function addSummaryItem(blockId: string) {
    setBlocks((currentBlocks) =>
      currentBlocks.map((block) => {
        if (block.id !== blockId) return block;

        const items = Array.isArray(block.data.items) ? [...block.data.items] : [];

        return {
          ...block,
          data: {
            ...block.data,
            items: [...items, ""],
          },
        };
      })
    );
  }

  function removeSummaryItem(blockId: string, itemIndex: number) {
    setBlocks((currentBlocks) =>
      currentBlocks.map((block) => {
        if (block.id !== blockId) return block;

        const items = Array.isArray(block.data.items) ? [...block.data.items] : [];

        return {
          ...block,
          data: {
            ...block.data,
            items: items.filter((_, index) => index !== itemIndex),
          },
        };
      })
    );
  }

  function updateFaqItem(
    blockId: string,
    itemIndex: number,
    field: "question" | "answer",
    value: string
  ) {
    setBlocks((currentBlocks) =>
      currentBlocks.map((block) => {
        if (block.id !== blockId) return block;

        const items = Array.isArray(block.data.items) ? [...block.data.items] : [];

        const currentItem =
          typeof items[itemIndex] === "object" && items[itemIndex] !== null
            ? (items[itemIndex] as { question?: string; answer?: string })
            : { question: "", answer: "" };

        items[itemIndex] = {
          ...currentItem,
          [field]: value,
        };

        return {
          ...block,
          data: {
            ...block.data,
            items,
          },
        };
      })
    );
  }

  function addFaqItem(blockId: string) {
    setBlocks((currentBlocks) =>
      currentBlocks.map((block) => {
        if (block.id !== blockId) return block;

        const items = Array.isArray(block.data.items) ? [...block.data.items] : [];

        return {
          ...block,
          data: {
            ...block.data,
            items: [...items, { question: "", answer: "" }],
          },
        };
      })
    );
  }

  function removeFaqItem(blockId: string, itemIndex: number) {
    setBlocks((currentBlocks) =>
      currentBlocks.map((block) => {
        if (block.id !== blockId) return block;

        const items = Array.isArray(block.data.items) ? [...block.data.items] : [];

        return {
          ...block,
          data: {
            ...block.data,
            items: items.filter((_, index) => index !== itemIndex),
          },
        };
      })
    );
  }

  function updateComparisonTitle(blockId: string, value: string) {
    setBlocks((current) =>
      current.map((block) => {
        if (block.id !== blockId) return block;

        return {
          ...block,
          data: {
            ...block.data,
            title: value,
          },
        };
      })
    );
  }

  function updateComparisonLeftTitle(blockId: string, value: string) {
    setBlocks((current) =>
      current.map((block) => {
        if (block.id !== blockId) return block;

        return {
          ...block,
          data: {
            ...block.data,
            leftTitle: value,
          },
        };
      })
    );
  }

  function updateComparisonRightTitle(blockId: string, value: string) {
    setBlocks((current) =>
      current.map((block) => {
        if (block.id !== blockId) return block;

        return {
          ...block,
          data: {
            ...block.data,
            rightTitle: value,
          },
        };
      })
    );
  }

  function addComparisonLeftItem(blockId: string) {
    setBlocks((current) =>
      current.map((block) => {
        if (block.id !== blockId) return block;

        const leftItems = Array.isArray(block.data.leftItems) ? [...block.data.leftItems] : [];

        return {
          ...block,
          data: {
            ...block.data,
            leftItems: [...leftItems, ""],
          },
        };
      })
    );
  }

  function addComparisonRightItem(blockId: string) {
    setBlocks((current) =>
      current.map((block) => {
        if (block.id !== blockId) return block;

        const rightItems = Array.isArray(block.data.rightItems) ? [...block.data.rightItems] : [];

        return {
          ...block,
          data: {
            ...block.data,
            rightItems: [...rightItems, ""],
          },
        };
      })
    );
  }

  function updateComparisonLeftItem(blockId: string, index: number, value: string) {
    setBlocks((current) =>
      current.map((block) => {
        if (block.id !== blockId) return block;

        const leftItems = Array.isArray(block.data.leftItems) ? [...block.data.leftItems] : [];
        leftItems[index] = value;

        return {
          ...block,
          data: {
            ...block.data,
            leftItems,
          },
        };
      })
    );
  }

  function updateComparisonRightItem(blockId: string, index: number, value: string) {
    setBlocks((current) =>
      current.map((block) => {
        if (block.id !== blockId) return block;

        const rightItems = Array.isArray(block.data.rightItems) ? [...block.data.rightItems] : [];
        rightItems[index] = value;

        return {
          ...block,
          data: {
            ...block.data,
            rightItems,
          },
        };
      })
    );
  }

  function updateExerciseTitle(blockId: string, value: string) {
    setBlocks((currentBlocks) =>
      currentBlocks.map((block) => {
        if (block.id !== blockId) return block;

        return {
          ...block,
          data: {
            ...block.data,
            title: value,
          },
        };
      })
    );
  }

  function updateExerciseDescription(blockId: string, value: string) {
    setBlocks((currentBlocks) =>
      currentBlocks.map((block) => {
        if (block.id !== blockId) return block;

        return {
          ...block,
          data: {
            ...block.data,
            description: value,
          },
        };
      })
    );
  }

  function updateExerciseStep(blockId: string, stepIndex: number, value: string) {
    setBlocks((currentBlocks) =>
      currentBlocks.map((block) => {
        if (block.id !== blockId) return block;

        const steps = Array.isArray(block.data.steps) ? [...block.data.steps] : [];

        steps[stepIndex] = value;

        return {
          ...block,
          data: {
            ...block.data,
            steps,
          },
        };
      })
    );
  }

  function addExerciseStep(blockId: string) {
    setBlocks((currentBlocks) =>
      currentBlocks.map((block) => {
        if (block.id !== blockId) return block;

        const steps = Array.isArray(block.data.steps) ? [...block.data.steps] : [];

        return {
          ...block,
          data: {
            ...block.data,
            steps: [...steps, ""],
          },
        };
      })
    );
  }

  function removeExerciseStep(blockId: string, stepIndex: number) {
    setBlocks((currentBlocks) =>
      currentBlocks.map((block) => {
        if (block.id !== blockId) return block;

        const steps = Array.isArray(block.data.steps) ? [...block.data.steps] : [];

        return {
          ...block,
          data: {
            ...block.data,
            steps: steps.filter((_, index) => index !== stepIndex),
          },
        };
      })
    );
  }

  function updateInfoCardTitle(blockId: string, value: string) {
    setBlocks((currentBlocks) =>
      currentBlocks.map((block) => {
        if (block.id !== blockId) return block;

        return {
          ...block,
          data: {
            ...block.data,
            title: value,
          },
        };
      })
    );
  }

  function updateInfoCardText(blockId: string, value: string) {
    setBlocks((currentBlocks) =>
      currentBlocks.map((block) => {
        if (block.id !== blockId) return block;

        return {
          ...block,
          data: {
            ...block.data,
            text: value,
          },
        };
      })
    );
  }

  function updateRelatedArticleField(
    blockId: string,
    field: "title" | "text" | "linkText" | "href",
    value: string
  ) {
    setBlocks((currentBlocks) =>
      currentBlocks.map((block) => {
        if (block.id !== blockId) return block;

        return {
          ...block,
          data: {
            ...block.data,
            [field]: value,
          },
        };
      })
    );
  }

  function updateCtaField(
    blockId: string,
    field: "title" | "text" | "buttonText" | "href",
    value: string
  ) {
    setBlocks((currentBlocks) =>
      currentBlocks.map((block) => {
        if (block.id !== blockId) return block;

        return {
          ...block,
          data: {
            ...block.data,
            [field]: value,
          },
        };
      })
    );
  }

  function updateImageField(blockId: string, field: "url" | "alt" | "caption", value: string) {
    setBlocks((currentBlocks) =>
      currentBlocks.map((block) => {
        if (block.id !== blockId) return block;

        return {
          ...block,
          data: {
            ...block.data,
            [field]: value,
          },
        };
      })
    );
  }

  async function uploadImageForBlock(blockId: string, file: File) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "nutricao-em-movimento/articles/content");

    const response = await fetch("/api/upload/image", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.url) {
      updateImageField(blockId, "url", data.url);
    } else {
      alert(data.error || "Erro ao enviar imagem.");
    }
  }

  function updateTableCaption(blockId: string, value: string) {
    setBlocks((currentBlocks) =>
      currentBlocks.map((block) => {
        if (block.id !== blockId) return block;

        return {
          ...block,
          data: {
            ...block.data,
            caption: value,
          },
        };
      })
    );
  }

  function updateTableHeader(blockId: string, columnIndex: number, value: string) {
    setBlocks((currentBlocks) =>
      currentBlocks.map((block) => {
        if (block.id !== blockId) return block;

        const headers = Array.isArray(block.data.headers) ? [...block.data.headers] : [];

        headers[columnIndex] = value;

        return {
          ...block,
          data: {
            ...block.data,
            headers,
          },
        };
      })
    );
  }

  function updateTableCell(blockId: string, rowIndex: number, columnIndex: number, value: string) {
    setBlocks((currentBlocks) =>
      currentBlocks.map((block) => {
        if (block.id !== blockId) return block;

        const rows = Array.isArray(block.data.rows)
          ? block.data.rows.map((row) => (Array.isArray(row) ? [...row] : []))
          : [];

        if (!rows[rowIndex]) return block;

        rows[rowIndex][columnIndex] = value;

        return {
          ...block,
          data: {
            ...block.data,
            rows,
          },
        };
      })
    );
  }

  function addTableRow(blockId: string) {
    setBlocks((currentBlocks) =>
      currentBlocks.map((block) => {
        if (block.id !== blockId) return block;

        const headers = Array.isArray(block.data.headers) ? block.data.headers : [];

        const rows = Array.isArray(block.data.rows)
          ? block.data.rows.map((row) => (Array.isArray(row) ? [...row] : []))
          : [];

        return {
          ...block,
          data: {
            ...block.data,
            rows: [...rows, headers.map(() => "")],
          },
        };
      })
    );
  }

  function removeTableRow(blockId: string, rowIndex: number) {
    setBlocks((currentBlocks) =>
      currentBlocks.map((block) => {
        if (block.id !== blockId) return block;

        const rows = Array.isArray(block.data.rows)
          ? block.data.rows.map((row) => (Array.isArray(row) ? [...row] : []))
          : [];

        return {
          ...block,
          data: {
            ...block.data,
            rows: rows.filter((_, index) => index !== rowIndex),
          },
        };
      })
    );
  }

  function addTableColumn(blockId: string) {
    setBlocks((currentBlocks) =>
      currentBlocks.map((block) => {
        if (block.id !== blockId) return block;

        const headers = Array.isArray(block.data.headers) ? [...block.data.headers] : [];

        const rows = Array.isArray(block.data.rows)
          ? block.data.rows.map((row) => (Array.isArray(row) ? [...row] : []))
          : [];

        const nextHeaders = [...headers, `Coluna ${headers.length + 1}`];

        return {
          ...block,
          data: {
            ...block.data,
            headers: nextHeaders,
            rows: rows.map((row) => [...row, ""]),
          },
        };
      })
    );
  }

  function removeTableColumn(blockId: string, columnIndex: number) {
    setBlocks((currentBlocks) =>
      currentBlocks.map((block) => {
        if (block.id !== blockId) return block;

        const headers = Array.isArray(block.data.headers) ? [...block.data.headers] : [];

        const rows = Array.isArray(block.data.rows)
          ? block.data.rows.map((row) => (Array.isArray(row) ? [...row] : []))
          : [];

        if (headers.length <= 1) return block;

        return {
          ...block,
          data: {
            ...block.data,
            headers: headers.filter((_, index) => index !== columnIndex),
            rows: rows.map((row) => row.filter((_, index) => index !== columnIndex)),
          },
        };
      })
    );
  }

  return (
    <div className="grid gap-6 rounded-[2rem] border border-black/10 bg-[#FAF8F4] p-5">
      <input type="hidden" name={name} value={serializedBlocks} />

      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-bold">Editor visual</p>
          <p className="mt-1 text-xs leading-5 text-neutral-500">
            Monte o artigo por blocos. O sistema vai gerar o HTML padronizado do blog
            automaticamente.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsPreviewOpen(true)}
          className="w-fit rounded-full bg-[#111111] px-5 py-2.5 text-sm font-bold !text-white transition hover:bg-[#556B2F]"
        >
          Visualizar artigo
        </button>
      </div>

      <button
        type="button"
        onClick={() => setIsHomePreviewOpen(true)}
        className="w-fit rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-bold text-[#111111] transition hover:border-[#556B2F] hover:text-[#556B2F]"
      >
        Visualizar card da Home
      </button>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {blockButtons.map((button) => (
          <button
            key={`${button.label}-${button.type}`}
            type="button"
            onClick={() => addBlock(button.type, button.label)}
            className="rounded-2xl border border-black/10 bg-white p-4 text-left transition hover:border-[#556B2F] hover:shadow-sm"
          >
            <span className="block text-sm font-bold">{button.label}</span>
            <span className="mt-1 block text-xs leading-5 text-neutral-500">
              {button.description}
            </span>
          </button>
        ))}
      </div>

      {blocks.length === 0 && (
        <div className="rounded-2xl border border-dashed border-black/15 bg-white p-6 text-center text-sm text-neutral-500">
          Nenhum bloco criado ainda. Comece adicionando um título ou parágrafo.
        </div>
      )}

      <div className="grid gap-4">
        {blocks.map((block, index) => (
          <div key={block.id} className="rounded-[1.5rem] border border-black/10 bg-white p-4">
            <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D67A5A]">
                  Bloco {index + 1}
                </p>
                <p className="mt-1 text-sm font-bold">{getBlockLabel(block)}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => moveBlock(block.id, "up")}
                  disabled={index === 0}
                  className="rounded-full border border-black/10 px-3 py-2 text-xs font-bold disabled:opacity-40"
                >
                  Subir
                </button>

                <button
                  type="button"
                  onClick={() => moveBlock(block.id, "down")}
                  disabled={index === blocks.length - 1}
                  className="rounded-full border border-black/10 px-3 py-2 text-xs font-bold disabled:opacity-40"
                >
                  Descer
                </button>

                <button
                  type="button"
                  onClick={() => removeBlock(block.id)}
                  className="rounded-full border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700"
                >
                  Remover
                </button>
              </div>
            </div>

            {renderBlockEditor({
              block,
              updateBlockText,
              updateListItem,
              addListItem,
              removeListItem,
              updateSummaryTitle,
              updateSummaryItem,
              addSummaryItem,
              removeSummaryItem,
              updateFaqItem,
              addFaqItem,
              removeFaqItem,
              updateComparisonTitle,
              updateComparisonLeftTitle,
              updateComparisonRightTitle,
              addComparisonLeftItem,
              addComparisonRightItem,
              updateComparisonLeftItem,
              updateComparisonRightItem,
              updateExerciseTitle,
              updateExerciseDescription,
              updateExerciseStep,
              addExerciseStep,
              removeExerciseStep,
              updateInfoCardTitle,
              updateInfoCardText,
              updateRelatedArticleField,
              updateCtaField,
              updateImageField,
              uploadImageForBlock,
              updateTableCaption,
              updateTableHeader,
              updateTableCell,
              addTableRow,
              removeTableRow,
              addTableColumn,
              removeTableColumn,
            })}
          </div>
        ))}
      </div>

      {isPreviewOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/60 p-4 backdrop-blur-sm">
          <div className="mx-auto flex h-full max-w-6xl flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl">
            <div className="flex flex-col justify-between gap-3 border-b border-black/10 p-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-bold">Pré-visualização do artigo</p>
                <p className="mt-1 text-xs text-neutral-500">
                  Confira como o conteúdo será exibido antes de publicar.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-[#FAF8F4] px-4 py-2 text-xs font-bold text-neutral-600">
                  {previewMode === "desktop" && "🖥️ Visualização Desktop"}
                  {previewMode === "tablet" && "📱 Visualização Tablet"}
                  {previewMode === "mobile" && "📲 Visualização Mobile"}
                </span>

                <button
                  type="button"
                  onClick={() => setPreviewMode("desktop")}
                  className={`rounded-full px-4 py-2 text-xs font-bold ${
                    previewMode === "desktop"
                      ? "bg-[#111111] !text-white"
                      : "border border-black/10 bg-white text-[#111111]"
                  }`}
                >
                  Desktop
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewMode("tablet")}
                  className={`rounded-full px-4 py-2 text-xs font-bold ${
                    previewMode === "tablet"
                      ? "bg-[#111111] !text-white"
                      : "border border-black/10 bg-white text-[#111111]"
                  }`}
                >
                  Tablet
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewMode("mobile")}
                  className={`rounded-full px-4 py-2 text-xs font-bold ${
                    previewMode === "mobile"
                      ? "bg-[#111111] !text-white"
                      : "border border-black/10 bg-white text-[#111111]"
                  }`}
                >
                  Mobile
                </button>

                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(false)}
                  className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-bold text-[#111111] transition hover:border-red-300 hover:text-red-700"
                >
                  Fechar
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-[#FAF8F4] p-4 sm:p-6">
              <div
                className={`mx-auto rounded-[1.5rem] bg-white p-5 shadow-sm sm:p-8 ${
                  previewMode === "mobile"
                    ? "max-w-[390px] text-[0.95rem]"
                    : previewMode === "tablet"
                      ? "max-w-[720px] text-[1rem]"
                      : "max-w-[1040px] text-[1.05rem]"
                }`}
              >
                <div>
                  <header className="rounded-[1.5rem] bg-[#FAF8F4] p-5 sm:p-8">
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#D67A5A]">
                      {previewData?.categoryName || "Categoria"}
                    </p>

                    <h1
                      className={`mt-5 font-semibold leading-tight ${
                        previewMode === "mobile"
                          ? "text-3xl"
                          : previewMode === "tablet"
                            ? "text-4xl"
                            : "text-5xl"
                      }`}
                    >
                      {previewData?.title || "Título do artigo"}
                    </h1>

                    <p className="mt-5 text-base leading-8 text-neutral-700 sm:text-lg">
                      {previewData?.description || "Descrição/resumo do artigo aparecerá aqui."}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3 text-sm text-neutral-500">
                      <span>
                        {new Intl.DateTimeFormat("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        }).format(new Date())}
                      </span>
                      <span>•</span>
                      <span>{previewData?.readTime || "5 min de leitura"}</span>
                    </div>
                  </header>

                  <div className="mt-6">
                    <div
                      className={`overflow-hidden rounded-[1.5rem] bg-[#E9DCC9] ${
                        previewMode === "mobile" ? "aspect-[4/3]" : "aspect-[16/9]"
                      }`}
                    >
                      {previewData?.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={previewData.coverImage}
                          alt={previewData.title || "Capa do artigo"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center p-6 text-center text-sm text-neutral-500">
                          Capa do artigo
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-8">
                    {blocks.length === 0 ? (
                      <p className="text-center text-sm text-neutral-500">
                        Adicione blocos para visualizar o conteúdo.
                      </p>
                    ) : (
                      <div
                        className="article-content text-lg leading-9 text-neutral-800"
                        dangerouslySetInnerHTML={{ __html: previewHtml }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isHomePreviewOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[2rem] bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold">Prévia do card da Home</p>
                <p className="mt-1 text-xs text-neutral-500">
                  Veja como o artigo aparecerá nos blocos de artigos do site.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsHomePreviewOpen(false)}
                className="rounded-full border border-black/10 px-4 py-2 text-xs font-bold"
              >
                Fechar
              </button>
            </div>

            <div className="w-full overflow-hidden rounded-[1.75rem] border border-black/5 bg-white shadow-sm">
              <div
                className="h-[210px] w-full bg-[#E9DCC9] bg-cover bg-center"
                style={
                  previewData?.coverImage
                    ? { backgroundImage: `url(${previewData.coverImage})` }
                    : undefined
                }
              >
                {!previewData?.coverImage && (
                  <div className="flex h-full items-center justify-center text-sm text-neutral-500">
                    Capa do artigo
                  </div>
                )}
              </div>

              <div className="w-full bg-white px-6 pb-6 pt-5">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#D67A5A]">
                  {previewData?.categoryName || "Categoria"}
                </p>

                <h3 className="mt-4 line-clamp-3 text-2xl font-semibold leading-tight text-[#111111]">
                  {previewData?.title || "Título do artigo"}
                </h3>

                <p className="mt-4 line-clamp-4 text-sm leading-7 text-neutral-700">
                  {previewData?.description || "Descrição/resumo do artigo aparecerá aqui."}
                </p>

                <span className="mt-6 inline-flex text-sm font-bold text-[#556B2F]">
                  Ler artigo
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getBlockLabel(block: EditorBlock) {
  if (block.type === "heading") {
    return block.data.level === 3 ? "Subtítulo H3" : "Título H2";
  }

  if (block.type === "paragraph") return "Parágrafo";
  if (block.type === "unorderedList") return "Lista";
  if (block.type === "orderedList") return "Lista numerada";

  return block.type;
}

type RenderBlockEditorProps = {
  block: EditorBlock;
  updateBlockText: (blockId: string, text: string) => void;
  updateListItem: (blockId: string, itemIndex: number, value: string) => void;
  addListItem: (blockId: string) => void;
  removeListItem: (blockId: string, itemIndex: number) => void;
  updateSummaryTitle: (blockId: string, title: string) => void;
  updateSummaryItem: (blockId: string, itemIndex: number, value: string) => void;
  addSummaryItem: (blockId: string) => void;
  removeSummaryItem: (blockId: string, itemIndex: number) => void;
  updateFaqItem: (
    blockId: string,
    itemIndex: number,
    field: "question" | "answer",
    value: string
  ) => void;
  addFaqItem: (blockId: string) => void;
  removeFaqItem: (blockId: string, itemIndex: number) => void;
  updateComparisonTitle: (blockId: string, value: string) => void;
  updateComparisonLeftTitle: (blockId: string, value: string) => void;
  updateComparisonRightTitle: (blockId: string, value: string) => void;
  addComparisonLeftItem: (blockId: string) => void;
  addComparisonRightItem: (blockId: string) => void;
  updateComparisonLeftItem: (blockId: string, index: number, value: string) => void;
  updateComparisonRightItem: (blockId: string, index: number, value: string) => void;
  updateExerciseTitle: (blockId: string, value: string) => void;
  updateExerciseDescription: (blockId: string, value: string) => void;
  updateExerciseStep: (blockId: string, stepIndex: number, value: string) => void;
  addExerciseStep: (blockId: string) => void;
  removeExerciseStep: (blockId: string, stepIndex: number) => void;
  updateInfoCardTitle: (blockId: string, value: string) => void;
  updateInfoCardText: (blockId: string, value: string) => void;
  updateRelatedArticleField: (
    blockId: string,
    field: "title" | "text" | "linkText" | "href",
    value: string
  ) => void;
  updateCtaField: (
    blockId: string,
    field: "title" | "text" | "buttonText" | "href",
    value: string
  ) => void;
  updateImageField: (blockId: string, field: "url" | "alt" | "caption", value: string) => void;
  uploadImageForBlock: (blockId: string, file: File) => Promise<void>;
  updateTableCaption: (blockId: string, value: string) => void;
  updateTableHeader: (blockId: string, columnIndex: number, value: string) => void;
  updateTableCell: (blockId: string, rowIndex: number, columnIndex: number, value: string) => void;
  addTableRow: (blockId: string) => void;
  removeTableRow: (blockId: string, rowIndex: number) => void;
  addTableColumn: (blockId: string) => void;
  removeTableColumn: (blockId: string, columnIndex: number) => void;
};

function renderBlockEditor({
  block,
  updateBlockText,
  updateListItem,
  addListItem,
  removeListItem,
  updateSummaryTitle,
  updateSummaryItem,
  addSummaryItem,
  removeSummaryItem,
  updateFaqItem,
  addFaqItem,
  removeFaqItem,
  updateComparisonTitle,
  updateComparisonLeftTitle,
  updateComparisonRightTitle,
  addComparisonLeftItem,
  addComparisonRightItem,
  updateComparisonLeftItem,
  updateComparisonRightItem,
  updateExerciseTitle,
  updateExerciseDescription,
  updateExerciseStep,
  addExerciseStep,
  removeExerciseStep,
  updateInfoCardTitle,
  updateInfoCardText,
  updateRelatedArticleField,
  updateCtaField,
  updateImageField,
  uploadImageForBlock,
  updateTableCaption,
  updateTableHeader,
  updateTableCell,
  addTableRow,
  removeTableRow,
  addTableColumn,
  removeTableColumn,
}: RenderBlockEditorProps) {
  if (block.type === "heading" || block.type === "paragraph") {
    return (
      <textarea
        value={String(block.data.text || "")}
        onChange={(event) => updateBlockText(block.id, event.target.value)}
        rows={block.type === "paragraph" ? 5 : 2}
        placeholder={
          block.type === "heading" ? "Digite o título da seção..." : "Digite o parágrafo..."
        }
        className="w-full rounded-2xl border border-black/10 bg-[#FAF8F4] p-4 text-sm leading-7 outline-none focus:border-[#556B2F]"
      />
    );
  }

  if (block.type === "orderedList" || block.type === "unorderedList") {
    const items = Array.isArray(block.data.items) ? block.data.items : [];

    return (
      <div className="grid gap-3">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              value={String(item || "")}
              onChange={(event) => updateListItem(block.id, index, event.target.value)}
              placeholder={`Item ${index + 1}`}
              className="h-12 flex-1 rounded-2xl border border-black/10 bg-[#FAF8F4] px-4 text-sm outline-none focus:border-[#556B2F]"
            />

            <button
              type="button"
              onClick={() => removeListItem(block.id, index)}
              disabled={items.length <= 1}
              className="rounded-2xl border border-red-200 bg-red-50 px-4 text-xs font-bold text-red-700 disabled:opacity-40"
            >
              Remover
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => addListItem(block.id)}
          className="w-fit rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-bold transition hover:border-[#556B2F] hover:text-[#556B2F]"
        >
          + Adicionar item
        </button>
      </div>
    );
  }

  if (block.type === "summary") {
    const items = Array.isArray(block.data.items) ? block.data.items : [];

    return (
      <div className="grid gap-4 rounded-2xl border border-[#D8E8D1] bg-[#F5FAF3] p-4">
        <div className="grid gap-2">
          <label className="text-xs font-bold uppercase tracking-[0.18em] text-[#556B2F]">
            Título do resumo
          </label>
          <input
            value={String(block.data.title || "")}
            onChange={(event) => updateSummaryTitle(block.id, event.target.value)}
            placeholder="Resumo rápido"
            className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-[#556B2F]"
          />
        </div>

        <div className="grid gap-3">
          {items.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input
                value={String(item || "")}
                onChange={(event) => updateSummaryItem(block.id, index, event.target.value)}
                placeholder={`Ponto principal ${index + 1}`}
                className="h-12 flex-1 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-[#556B2F]"
              />

              <button
                type="button"
                onClick={() => removeSummaryItem(block.id, index)}
                disabled={items.length <= 1}
                className="rounded-2xl border border-red-200 bg-red-50 px-4 text-xs font-bold text-red-700 disabled:opacity-40"
              >
                Remover
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => addSummaryItem(block.id)}
            className="w-fit rounded-full border border-[#D8E8D1] bg-white px-4 py-2 text-xs font-bold text-[#556B2F] transition hover:bg-[#EEF6EA]"
          >
            + Adicionar ponto
          </button>
        </div>
      </div>
    );
  }

  if (block.type === "faq") {
    const items = Array.isArray(block.data.items) ? block.data.items : [];

    return (
      <div className="grid gap-4 rounded-2xl border border-black/10 bg-[#FAF8F4] p-4">
        {items.map((item, index) => {
          const faqItem =
            typeof item === "object" && item !== null
              ? (item as { question?: string; answer?: string })
              : { question: "", answer: "" };

          return (
            <div key={index} className="grid gap-3 rounded-2xl border border-black/10 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#556B2F]">
                  Pergunta {index + 1}
                </p>

                <button
                  type="button"
                  onClick={() => removeFaqItem(block.id, index)}
                  disabled={items.length <= 1}
                  className="rounded-full border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 disabled:opacity-40"
                >
                  Remover
                </button>
              </div>

              <input
                value={faqItem.question ?? ""}
                onChange={(event) => updateFaqItem(block.id, index, "question", event.target.value)}
                placeholder="Digite a pergunta..."
                className="h-12 rounded-2xl border border-black/10 bg-[#FAF8F4] px-4 text-sm outline-none focus:border-[#556B2F]"
              />

              <textarea
                value={faqItem.answer ?? ""}
                onChange={(event) => updateFaqItem(block.id, index, "answer", event.target.value)}
                rows={4}
                placeholder="Digite a resposta..."
                className="rounded-2xl border border-black/10 bg-[#FAF8F4] p-4 text-sm leading-7 outline-none focus:border-[#556B2F]"
              />
            </div>
          );
        })}

        <button
          type="button"
          onClick={() => addFaqItem(block.id)}
          className="w-fit rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-bold transition hover:border-[#556B2F] hover:text-[#556B2F]"
        >
          + Adicionar pergunta
        </button>
      </div>
    );
  }

  if (block.type === "comparisonCard") {
    const leftItems = Array.isArray(block.data.leftItems) ? block.data.leftItems : [];
    const rightItems = Array.isArray(block.data.rightItems) ? block.data.rightItems : [];

    return (
      <div className="grid gap-6 rounded-2xl border border-black/10 bg-[#FAF8F4] p-5">
        <input
          value={String(block.data.title || "")}
          onChange={(e) => updateComparisonTitle(block.id, e.target.value)}
          placeholder="Título opcional"
          className="h-12 rounded-2xl border border-black/10 bg-white px-4"
        />

        <div className="grid gap-6 md:grid-cols-2">
          <div className="grid gap-3">
            <input
              value={String(block.data.leftTitle || "")}
              onChange={(e) => updateComparisonLeftTitle(block.id, e.target.value)}
              placeholder="Título esquerdo"
              className="h-12 rounded-2xl border border-black/10 bg-white px-4"
            />

            {leftItems.map((item, index) => (
              <input
                key={index}
                value={String(item || "")}
                onChange={(e) => updateComparisonLeftItem(block.id, index, e.target.value)}
                placeholder={`Item ${index + 1}`}
                className="h-12 rounded-2xl border border-black/10 bg-white px-4"
              />
            ))}

            <button type="button" onClick={() => addComparisonLeftItem(block.id)}>
              + Item esquerdo
            </button>
          </div>

          <div className="grid gap-3">
            <input
              value={String(block.data.rightTitle || "")}
              onChange={(e) => updateComparisonRightTitle(block.id, e.target.value)}
              placeholder="Título direito"
              className="h-12 rounded-2xl border border-black/10 bg-white px-4"
            />

            {rightItems.map((item, index) => (
              <input
                key={index}
                value={String(item || "")}
                onChange={(e) => updateComparisonRightItem(block.id, index, e.target.value)}
                placeholder={`Item ${index + 1}`}
                className="h-12 rounded-2xl border border-black/10 bg-white px-4"
              />
            ))}

            <button type="button" onClick={() => addComparisonRightItem(block.id)}>
              + Item direito
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (block.type === "exercise") {
    const steps = Array.isArray(block.data.steps) ? block.data.steps : [];

    return (
      <div className="grid gap-4 rounded-2xl border border-[#D8E8D1] bg-[#F5FAF3] p-4">
        <div className="grid gap-2">
          <label className="text-xs font-bold uppercase tracking-[0.18em] text-[#556B2F]">
            Título do exercício
          </label>
          <input
            value={String(block.data.title || "")}
            onChange={(event) => updateExerciseTitle(block.id, event.target.value)}
            placeholder="Exercício rápido"
            className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-[#556B2F]"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-xs font-bold uppercase tracking-[0.18em] text-[#556B2F]">
            Descrição opcional
          </label>
          <textarea
            value={String(block.data.description || "")}
            onChange={(event) => updateExerciseDescription(block.id, event.target.value)}
            rows={3}
            placeholder="Explique rapidamente quando ou como usar este exercício..."
            className="rounded-2xl border border-black/10 bg-white p-4 text-sm leading-7 outline-none focus:border-[#556B2F]"
          />
        </div>

        <div className="grid gap-3">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-2">
              <input
                value={String(step || "")}
                onChange={(event) => updateExerciseStep(block.id, index, event.target.value)}
                placeholder={`Passo ${index + 1}`}
                className="h-12 flex-1 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-[#556B2F]"
              />

              <button
                type="button"
                onClick={() => removeExerciseStep(block.id, index)}
                disabled={steps.length <= 1}
                className="rounded-2xl border border-red-200 bg-red-50 px-4 text-xs font-bold text-red-700 disabled:opacity-40"
              >
                Remover
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => addExerciseStep(block.id)}
            className="w-fit rounded-full border border-[#D8E8D1] bg-white px-4 py-2 text-xs font-bold text-[#556B2F] transition hover:bg-[#EEF6EA]"
          >
            + Adicionar passo
          </button>
        </div>
      </div>
    );
  }

  if (block.type === "infoCard") {
    return (
      <div className="grid gap-4 rounded-2xl border border-[#E9DCC9] bg-[#FAF8F4] p-4">
        <div className="grid gap-2">
          <label className="text-xs font-bold uppercase tracking-[0.18em] text-[#556B2F]">
            Título do destaque
          </label>

          <input
            value={String(block.data.title || "")}
            onChange={(event) => updateInfoCardTitle(block.id, event.target.value)}
            placeholder="Importante"
            className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-[#556B2F]"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-xs font-bold uppercase tracking-[0.18em] text-[#556B2F]">
            Texto do destaque
          </label>

          <textarea
            value={String(block.data.text || "")}
            onChange={(event) => updateInfoCardText(block.id, event.target.value)}
            rows={4}
            placeholder="Digite a observação, alerta ou explicação importante..."
            className="rounded-2xl border border-black/10 bg-white p-4 text-sm leading-7 outline-none focus:border-[#556B2F]"
          />
        </div>
      </div>
    );
  }

  if (block.type === "relatedArticle") {
    return (
      <div className="grid gap-4 rounded-2xl border border-[#F0D7A8] bg-[#FFF8EE] p-4">
        <div className="grid gap-2">
          <label className="text-xs font-bold uppercase tracking-[0.18em] text-[#8A5A00]">
            Título do bloco
          </label>

          <input
            value={String(block.data.title || "")}
            onChange={(event) => updateRelatedArticleField(block.id, "title", event.target.value)}
            placeholder="Leia também"
            className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-[#8A5A00]"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-xs font-bold uppercase tracking-[0.18em] text-[#8A5A00]">
            Texto de apoio
          </label>

          <textarea
            value={String(block.data.text || "")}
            onChange={(event) => updateRelatedArticleField(block.id, "text", event.target.value)}
            rows={3}
            placeholder="Texto curto para incentivar a leitura..."
            className="rounded-2xl border border-black/10 bg-white p-4 text-sm leading-7 outline-none focus:border-[#8A5A00]"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-[#8A5A00]">
              Texto do link
            </label>

            <input
              value={String(block.data.linkText || "")}
              onChange={(event) =>
                updateRelatedArticleField(block.id, "linkText", event.target.value)
              }
              placeholder="Ex: Leia o artigo sobre fome emocional"
              className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-[#8A5A00]"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-[#8A5A00]">
              URL do artigo
            </label>

            <input
              value={String(block.data.href || "")}
              onChange={(event) => updateRelatedArticleField(block.id, "href", event.target.value)}
              placeholder="/pt/artigos/slug-do-artigo"
              className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-[#8A5A00]"
            />
          </div>
        </div>
      </div>
    );
  }

  if (block.type === "cta") {
    return (
      <div className="grid gap-4 rounded-2xl border border-black/10 bg-[#111111] p-4 text-white">
        <div className="grid gap-2">
          <label className="text-xs font-bold uppercase tracking-[0.18em] text-[#E9DCC9]">
            Título do CTA
          </label>

          <input
            value={String(block.data.title || "")}
            onChange={(event) => updateCtaField(block.id, "title", event.target.value)}
            placeholder="Quer receber mais conteúdos como este?"
            className="h-12 rounded-2xl border border-white/10 bg-white px-4 text-sm text-[#111111] outline-none focus:border-[#E9DCC9]"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-xs font-bold uppercase tracking-[0.18em] text-[#E9DCC9]">
            Texto do CTA
          </label>

          <textarea
            value={String(block.data.text || "")}
            onChange={(event) => updateCtaField(block.id, "text", event.target.value)}
            rows={4}
            placeholder="Texto curto para incentivar a ação..."
            className="rounded-2xl border border-white/10 bg-white p-4 text-sm leading-7 text-[#111111] outline-none focus:border-[#E9DCC9]"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-[#E9DCC9]">
              Texto do botão
            </label>

            <input
              value={String(block.data.buttonText || "")}
              onChange={(event) => updateCtaField(block.id, "buttonText", event.target.value)}
              placeholder="Inscrever-se na newsletter"
              className="h-12 rounded-2xl border border-white/10 bg-white px-4 text-sm text-[#111111] outline-none focus:border-[#E9DCC9]"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-[#E9DCC9]">
              Link do botão
            </label>

            <input
              value={String(block.data.href || "")}
              onChange={(event) => updateCtaField(block.id, "href", event.target.value)}
              placeholder="/pt#newsletter"
              className="h-12 rounded-2xl border border-white/10 bg-white px-4 text-sm text-[#111111] outline-none focus:border-[#E9DCC9]"
            />
          </div>
        </div>
      </div>
    );
  }

  if (block.type === "image") {
    return (
      <div className="grid gap-4 rounded-2xl border border-black/10 bg-[#FAF8F4] p-4">
        <div className="overflow-hidden rounded-2xl bg-[#E9DCC9]">
          {block.data.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={String(block.data.url)}
              alt={String(block.data.alt || "Imagem do artigo")}
              className="h-auto w-full object-cover"
            />
          ) : (
            <div className="flex min-h-[220px] items-center justify-center p-6 text-center text-sm text-neutral-500">
              Nenhuma imagem enviada ainda.
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="inline-flex w-fit cursor-pointer rounded-full bg-[#111111] px-5 py-3 text-sm font-bold !text-white transition hover:bg-[#556B2F]">
            Enviar imagem
            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];

                if (file) {
                  void uploadImageForBlock(block.id, file);
                }
              }}
              className="hidden"
            />
          </label>

          <p className="text-xs leading-5 text-neutral-500">
            A imagem será enviada para o Cloudinary e inserida exatamente neste ponto do artigo.
          </p>
        </div>

        <div className="grid gap-2">
          <label className="text-xs font-bold uppercase tracking-[0.18em] text-[#556B2F]">
            URL da imagem
          </label>

          <input
            value={String(block.data.url || "")}
            onChange={(event) => updateImageField(block.id, "url", event.target.value)}
            placeholder="https://res.cloudinary.com/..."
            className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-[#556B2F]"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-xs font-bold uppercase tracking-[0.18em] text-[#556B2F]">
            Texto alternativo SEO
          </label>

          <input
            value={String(block.data.alt || "")}
            onChange={(event) => updateImageField(block.id, "alt", event.target.value)}
            placeholder="Descreva a imagem de forma clara e objetiva"
            className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-[#556B2F]"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-xs font-bold uppercase tracking-[0.18em] text-[#556B2F]">
            Legenda opcional
          </label>

          <input
            value={String(block.data.caption || "")}
            onChange={(event) => updateImageField(block.id, "caption", event.target.value)}
            placeholder="Legenda que aparecerá abaixo da imagem"
            className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-[#556B2F]"
          />
        </div>
      </div>
    );
  }

  if (block.type === "table") {
    const headers = Array.isArray(block.data.headers) ? block.data.headers : [];

    const rows = Array.isArray(block.data.rows)
      ? block.data.rows.map((row) => (Array.isArray(row) ? row : []))
      : [];

    return (
      <div className="grid gap-4 rounded-2xl border border-black/10 bg-[#FAF8F4] p-4">
        <div className="grid gap-2">
          <label className="text-xs font-bold uppercase tracking-[0.18em] text-[#556B2F]">
            Legenda opcional da tabela
          </label>

          <input
            value={String(block.data.caption || "")}
            onChange={(event) => updateTableCaption(block.id, event.target.value)}
            placeholder="Ex: Diferenças entre fome física e fome emocional"
            className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-[#556B2F]"
          />
        </div>

        <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white">
          <table className="min-w-[640px] w-full border-collapse text-sm">
            <thead>
              <tr>
                {headers.map((header, columnIndex) => (
                  <th
                    key={columnIndex}
                    className="border-b border-black/10 bg-[#E9DCC9] p-3 text-left align-top"
                  >
                    <div className="grid gap-2">
                      <input
                        value={String(header || "")}
                        onChange={(event) =>
                          updateTableHeader(block.id, columnIndex, event.target.value)
                        }
                        className="h-10 rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:border-[#556B2F]"
                      />

                      <button
                        type="button"
                        onClick={() => removeTableColumn(block.id, columnIndex)}
                        disabled={headers.length <= 1}
                        className="w-fit rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[11px] font-bold text-red-700 disabled:opacity-40"
                      >
                        Remover coluna
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {headers.map((_, columnIndex) => (
                    <td key={columnIndex} className="border-b border-black/5 p-3 align-top">
                      <textarea
                        value={String(row[columnIndex] || "")}
                        onChange={(event) =>
                          updateTableCell(block.id, rowIndex, columnIndex, event.target.value)
                        }
                        rows={3}
                        className="w-full resize-y rounded-xl border border-black/10 bg-[#FAF8F4] p-3 text-sm leading-6 outline-none focus:border-[#556B2F]"
                      />
                    </td>
                  ))}

                  <td className="border-b border-black/5 p-3 align-top">
                    <button
                      type="button"
                      onClick={() => removeTableRow(block.id, rowIndex)}
                      disabled={rows.length <= 1}
                      className="rounded-full border border-red-200 bg-red-50 px-3 py-2 text-[11px] font-bold text-red-700 disabled:opacity-40"
                    >
                      Remover linha
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => addTableRow(block.id)}
            className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-bold transition hover:border-[#556B2F] hover:text-[#556B2F]"
          >
            + Adicionar linha
          </button>

          <button
            type="button"
            onClick={() => addTableColumn(block.id)}
            className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-bold transition hover:border-[#556B2F] hover:text-[#556B2F]"
          >
            + Adicionar coluna
          </button>
        </div>
      </div>
    );
  }

  return null;
}
