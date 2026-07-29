// Helpers puros da caixa de entrada de contatos (sem acesso a dados).

export type ContactStatus = "NEW" | "READ" | "ARCHIVED";

export const STATUS_LABEL: Record<ContactStatus, string> = {
  NEW: "Nova",
  READ: "Lida",
  ARCHIVED: "Arquivada",
};

export const STATUS_BADGE: Record<ContactStatus, string> = {
  NEW: "bg-green-100 text-green-700",
  READ: "bg-neutral-100 text-neutral-600",
  ARCHIVED: "bg-amber-100 text-amber-700",
};

export const FILTERS = [
  { key: "todas", label: "Todas", status: null },
  { key: "novas", label: "Novas", status: "NEW" as const },
  { key: "lidas", label: "Lidas", status: "READ" as const },
  { key: "arquivadas", label: "Arquivadas", status: "ARCHIVED" as const },
];

export function statusFromFilter(filter?: string): ContactStatus | null {
  const match = FILTERS.find((f) => f.key === filter);
  return match ? match.status : null;
}

// Normaliza o telefone para um link wa.me apenas quando é seguro.
// Retorna null se não parecer um número de telefone plausível.
export function toWhatsappHref(phone: string | null): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) return null;
  return `https://wa.me/${digits}`;
}
