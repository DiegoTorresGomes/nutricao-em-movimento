"use client";

import type { ScientificReference } from "@/lib/editor/references";

const fields: [keyof ScientificReference, string][] = [
  ["author", "Autor ou instituição"], ["title", "Título"],
  ["publication", "Periódico, publicação ou guideline"], ["year", "Ano"],
  ["doi", "DOI"], ["url", "URL"], ["sourceType", "Tipo de fonte (opcional)"],
];

export function ReferencesEditor({ items, onChange }: {
  items: unknown[];
  onChange: (items: unknown[]) => void;
}) {
  function replace(index: number, item: unknown) {
    onChange(items.map((current, i) => i === index ? item : current));
  }
  return <div className="grid gap-4">
    <p className="text-sm text-neutral-600">Identifique o documento consultado. Confira os dados na fonte; não preencha informações presumidas. Informe DOI ou URL quando disponíveis.</p>
    {items.map((item, index) => <fieldset key={index} className="grid gap-3 rounded-2xl border border-black/10 p-4">
      <legend className="px-2 font-bold">Referência {index + 1}</legend>
      {typeof item === "string" ? <label className="grid gap-1 text-sm">Referência legada
        <textarea value={item} onChange={event => replace(index, event.target.value)} className="w-full rounded-xl border p-3" />
      </label> : fields.map(([field, label]) => <label key={field} className="grid gap-1 text-sm">{label}
        <input type={field === "url" ? "url" : "text"} value={String((item as ScientificReference)?.[field] || "")}
          onChange={event => replace(index, { ...(item as ScientificReference), [field]: event.target.value })}
          className="min-w-0 w-full rounded-xl border p-3" />
      </label>)}
      <button type="button" onClick={() => onChange(items.filter((_, i) => i !== index))} className="justify-self-start text-sm text-red-700">Remover referência {index + 1}</button>
    </fieldset>)}
    <button type="button" onClick={() => onChange([...items, { author: "", title: "" }])} className="justify-self-start rounded-full border px-4 py-2 text-sm font-bold">Adicionar referência</button>
  </div>;
}
