"use client";

import { useMemo, useState } from "react";
import type { EditorBlock, EditorBlockType } from "@/lib/editor/blocks";

type BlockEditorProps = {
  name?: string;
  initialBlocks?: EditorBlock[];
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

  return {
    id,
    type,
    data: {},
  };
}

export function BlockEditor({ name = "contentBlocks", initialBlocks = [] }: BlockEditorProps) {
  const [blocks, setBlocks] = useState<EditorBlock[]>(initialBlocks);

  const serializedBlocks = useMemo(() => JSON.stringify(blocks), [blocks]);

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

  return (
    <div className="grid gap-6 rounded-[2rem] border border-black/10 bg-[#FAF8F4] p-5">
      <input type="hidden" name={name} value={serializedBlocks} />

      <div>
        <p className="text-sm font-bold">Editor visual</p>
        <p className="mt-1 text-xs leading-5 text-neutral-500">
          Monte o artigo por blocos. O sistema vai gerar o HTML padronizado do blog automaticamente.
        </p>
      </div>

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
            })}
          </div>
        ))}
      </div>
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

  return null;
}
