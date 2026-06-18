import type { EditorBlock } from "./blocks";

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderList(items: unknown[], ordered = false) {
  const tag = ordered ? "ol" : "ul";

  return `
<${tag} style="margin:28px 0;padding-left:24px;list-style-position:outside;line-height:1.85;font-size:16px;color:#111111;">
${items
  .map((item) => `<li style="display:list-item;margin:0 0 8px;">${escapeHtml(item)}</li>`)
  .join("")}
</${tag}>`;
}

export function renderBlocksToHtml(blocks: EditorBlock[]) {
  return blocks
    .map((block) => {
      const data = block.data;

      switch (block.type) {
        case "heading": {
          const level = data.level === 3 ? "h3" : "h2";
          return `<${level}>${escapeHtml(data.text)}</${level}>`;
        }

        case "paragraph":
          return `<p>${escapeHtml(data.text)}</p>`;

        case "unorderedList":
          return renderList(Array.isArray(data.items) ? data.items : [], false);

        case "orderedList":
          return renderList(Array.isArray(data.items) ? data.items : [], true);

        case "image":
          return `
<figure style="margin:32px 0;">
  <img src="${escapeHtml(data.url)}" alt="${escapeHtml(
    data.alt
  )}" style="display:block;width:100%;height:auto;border-radius:22px;" />
  ${
    data.caption
      ? `<figcaption style="margin-top:10px;font-size:14px;line-height:1.6;color:#666;">${escapeHtml(
          data.caption
        )}</figcaption>`
      : ""
  }
</figure>`;

        case "summary":
          return `
<div style="background:#F5FAF3;border:1px solid #D8E8D1;border-radius:22px;padding:22px;margin:28px 0;">
  <h3 style="margin:0 0 14px;color:#556B2F;font-size:22px;line-height:1.25;">📌 ${escapeHtml(
    data.title || "Resumo rápido"
  )}</h3>
  ${renderList(Array.isArray(data.items) ? data.items : [], false)}
</div>`;

        case "infoCard":
          return `
<div style="background:#FAF8F4;border:1px solid rgba(0,0,0,0.08);border-radius:22px;padding:22px;margin:28px 0;">
  <h3 style="margin:0 0 14px;color:#556B2F;font-size:22px;line-height:1.25;">${escapeHtml(
    data.title
  )}</h3>
  <p style="margin:0;line-height:1.8;">${escapeHtml(data.text)}</p>
</div>`;

        case "comparisonCard": {
          const leftItems = Array.isArray(data.leftItems) ? data.leftItems : [];
          const rightItems = Array.isArray(data.rightItems) ? data.rightItems : [];

          return `
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;margin:28px 0;">
  <div style="background:#FFF8F8;border:1px solid #F1D0D0;border-radius:22px;padding:22px;">
    <h3 style="margin:0 0 14px;color:#D67A5A;font-size:22px;line-height:1.25;">${escapeHtml(
      data.leftTitle
    )}</h3>
    ${renderList(leftItems, false)}
  </div>

  <div style="background:#F5FAF3;border:1px solid #D8E8D1;border-radius:22px;padding:22px;">
    <h3 style="margin:0 0 14px;color:#556B2F;font-size:22px;line-height:1.25;">${escapeHtml(
      data.rightTitle
    )}</h3>
    ${renderList(rightItems, false)}
  </div>
</div>`;
        }

        case "faq": {
          const items = Array.isArray(data.items) ? data.items : [];

          return `
<div style="display:flex;flex-direction:column;gap:16px;margin:28px 0;">
${items
  .map((item, index) => {
    const faqItem = item as {
      question?: unknown;
      answer?: unknown;
    };

    return `
  <div style="background:#FAF8F4;border-radius:20px;padding:20px;border:1px solid rgba(0,0,0,0.06);">
    <h3 style="margin:0 0 10px;color:#556B2F;font-size:20px;line-height:1.3;">${
      index + 1
    }. ${escapeHtml(faqItem.question)}</h3>
    <p style="margin:0;">${escapeHtml(faqItem.answer)}</p>
  </div>`;
  })
  .join("")}
</div>`;
        }

        case "relatedArticle":
          return `
<div style="background:#FFF8EE;border:1px solid #F0D7A8;border-radius:22px;padding:22px;margin:34px 0;">
  <h3 style="margin:0 0 12px;color:#8A5A00;font-size:22px;line-height:1.25;">📖 ${escapeHtml(
    data.title || "Leia também"
  )}</h3>
  <p style="margin:0 0 12px;line-height:1.8;">${escapeHtml(data.text)}</p>
  <p style="margin:0;line-height:1.8;"><strong>👉 <a href="${escapeHtml(
    data.href
  )}">${escapeHtml(data.linkText)}</a></strong></p>
</div>`;

        case "cta":
          return `
<div style="background:#111111;border-radius:24px;padding:24px;margin:36px 0;color:#FFFFFF;">
  <h2 style="margin-top:0;color:#FFFFFF;">${escapeHtml(data.title)}</h2>
  <p style="color:#FFFFFF;line-height:1.8;">${escapeHtml(data.text)}</p>
  ${
    data.href && data.buttonText
      ? `<p style="margin:22px 0 0;"><a href="${escapeHtml(
          data.href
        )}" style="display:inline-flex;border-radius:999px;background:#E9DCC9;color:#111111;padding:12px 18px;font-weight:700;text-decoration:none;">${escapeHtml(
          data.buttonText
        )}</a></p>`
      : ""
  }
</div>`;

        case "authorNote":
          return `
<div style="background:#FAF8F4;border-left:4px solid #556B2F;border-radius:20px;padding:22px;margin:34px 0;">
  <h2 style="margin-top:0;">Sobre a autora</h2>
  <p>${escapeHtml(data.text)}</p>
</div>`;

        case "disclaimer":
          return `
<div style="background:#FAF8F4;border:1px solid rgba(0,0,0,0.08);border-radius:22px;padding:22px;margin:28px 0;">
  <p style="margin:0;"><strong>Aviso importante:</strong> ${escapeHtml(data.text)}</p>
</div>`;

        case "references":
          return `
<h2>Referências sugeridas</h2>
${renderList(Array.isArray(data.items) ? data.items : [], false)}`;

        case "exercise": {
          const steps = Array.isArray(data.steps) ? data.steps : [];

          return `
<div style="background:#F5FAF3;border:1px solid #D8E8D1;border-radius:22px;padding:22px;margin:28px 0;">
  <h3 style="margin:0 0 12px;color:#556B2F;font-size:22px;line-height:1.25;">🧘 ${escapeHtml(
    data.title || "Exercício rápido"
  )}</h3>
  ${
    data.description
      ? `<p style="margin:0 0 16px;line-height:1.8;">${escapeHtml(data.description)}</p>`
      : ""
  }
  ${renderList(steps, true)}
</div>`;
        }

        case "table": {
          const headers = Array.isArray(data.headers) ? data.headers : [];
          const rows = Array.isArray(data.rows)
            ? data.rows.map((row) => (Array.isArray(row) ? row : []))
            : [];

          if (headers.length === 0 || rows.length === 0) {
            return "";
          }

          return `
<figure style="margin:32px 0;">
  ${
    data.caption
      ? `<figcaption style="margin-bottom:10px;font-size:14px;line-height:1.6;color:#666;">${escapeHtml(
          data.caption
        )}</figcaption>`
      : ""
  }
  <div style="width:100%;overflow-x:auto;border-radius:22px;border:1px solid rgba(0,0,0,0.08);background:#FAF8F4;">
    <table style="width:100%;min-width:640px;border-collapse:collapse;background:#FFFFFF;">
      <thead>
        <tr>
          ${headers
            .map(
              (header) =>
                `<th style="background:#E9DCC9;border:1px solid rgba(0,0,0,0.08);padding:14px;text-align:left;vertical-align:top;font-weight:700;color:#111111;">${escapeHtml(
                  header
                )}</th>`
            )
            .join("")}
        </tr>
      </thead>
      <tbody>
        ${rows
          .map(
            (row) => `
        <tr>
          ${headers
            .map(
              (_, columnIndex) =>
                `<td style="border:1px solid rgba(0,0,0,0.08);padding:14px;text-align:left;vertical-align:top;line-height:1.6;color:#404040;">${escapeHtml(
                  row[columnIndex] || ""
                )}</td>`
            )
            .join("")}
        </tr>`
          )
          .join("")}
      </tbody>
    </table>
  </div>
</figure>`;
        }

        default:
          return "";
      }
    })
    .join("\n\n");
}
