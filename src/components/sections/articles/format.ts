// Formato curto em português, ex.: "12 ago 2026" — usado em todos os cards e
// seções da página de Artigos. Um único helper evita divergência de formato
// entre destaque, recentes, mais lidos e a listagem completa.
const shortDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function formatShortDate(date: Date | string | null): string | null {
  if (!date) return null;
  const value = typeof date === "string" ? new Date(date) : date;
  // Remove o ponto que o Intl pt-BR adiciona após o mês abreviado ("ago." -> "ago").
  return shortDateFormatter.format(value).replace(".", "");
}
