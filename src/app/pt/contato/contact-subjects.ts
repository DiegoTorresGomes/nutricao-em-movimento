// Fonte única dos assuntos de contato — compartilhada entre o Client Component
// (formulário/cards) e o Server Action (allowlist de validação). O servidor
// NUNCA confia no valor do cliente: valida contra esta lista.

export const CONTACT_SUBJECTS = [
  "Consulta Online",
  "Consulta Presencial",
  "Parceria",
  "Imprensa",
  "Dúvida Geral",
] as const;

export type ContactSubject = (typeof CONTACT_SUBJECTS)[number];

export function isValidSubject(value: string): value is ContactSubject {
  return (CONTACT_SUBJECTS as readonly string[]).includes(value);
}

// Cards visuais de "Como posso ajudar?" — cada um seleciona o assunto
// correspondente no formulário. "Dúvida Geral" existe como assunto padrão do
// select, mas não recebe card próprio.
export const CONTACT_CARDS: {
  subject: ContactSubject;
  title: string;
  description: string;
}[] = [
  {
    subject: "Consulta Online",
    title: "Consultas Online",
    description:
      "Atendimento nutricional à distância, com orientação individualizada e acompanhamento profissional.",
  },
  {
    subject: "Consulta Presencial",
    title: "Consultas Presenciais",
    description:
      "Atendimento presencial para avaliação e acompanhamento nutricional.",
  },
  {
    subject: "Parceria",
    title: "Parcerias",
    description:
      "Projetos, conteúdos, campanhas, eventos e colaborações alinhadas à saúde e ao bem-estar.",
  },
  {
    subject: "Imprensa",
    title: "Imprensa",
    description:
      "Entrevistas, pautas, participações e contribuições técnicas para veículos e projetos editoriais.",
  },
];
