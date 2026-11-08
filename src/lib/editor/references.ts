export type ScientificReference = {
  author: string;
  title: string;
  publication?: string;
  year?: string;
  doi?: string;
  url?: string;
  sourceType?: string;
};

function escape(value: unknown) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

export function referenceUrl(reference: ScientificReference) {
  const doi = String(reference.doi || "").trim().replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, "");
  if (/^10\.\d{4,9}\/\S+$/i.test(doi)) return `https://doi.org/${doi.split("/").map(encodeURIComponent).join("/")}`;
  try {
    const url = new URL(String(reference.url || ""));
    if (["https:", "http:"].includes(url.protocol) && !url.username && !url.password) return url.href;
  } catch { /* A missing/invalid URL must not create an unsafe hyperlink. */ }
  return undefined;
}

// Existing references blocks use plain strings. Preserve those without
// guessing authors, years or links; new items have structured source fields.
export function renderReferences(items: unknown[], title = "Referências científicas") {
  const rows = items.flatMap(item => {
    if (typeof item === "string") return item.trim() ? [`<li>${escape(item)}</li>`] : [];
    if (!item || typeof item !== "object") return [];
    const ref = item as ScientificReference;
    if (!String(ref.title || "").trim()) return [];
    const citation = [ref.author, ref.title, ref.publication, ref.year].filter(Boolean).map(escape).join(". ");
    const url = referenceUrl(ref);
    return [`<li style="margin-bottom:16px;overflow-wrap:anywhere;">${citation}.${ref.sourceType ? ` <span>(${escape(ref.sourceType)})</span>` : ""}${url ? ` <a href="${escape(url)}" target="_blank" rel="noopener noreferrer">${escape(url)}</a>` : ""}</li>`];
  });
  if (!rows.length) return "";
  return `<section aria-label="Referências científicas"><h2>${escape(title)}</h2><ol style="padding-left:24px;list-style-type:decimal;line-height:1.8;overflow-wrap:anywhere;">${rows.join("\n")}</ol></section>`;
}
