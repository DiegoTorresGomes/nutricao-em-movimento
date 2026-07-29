export const nutritionistConfig = {
  // Nome legal completo (usado em schema/autoria).
  name: "Weverlyn da Cruz Alves Torres",
  // Nome de apresentação pública.
  displayName: "Weverlyn Alves",
  role: "Nutricionista",
  // CRN é opcional: só é exibido quando presente. Nunca renderizar placeholder.
  crn: "CRN 24101524",

  // Título editorial e resumo da página Sobre.
  headline: "Ciência, acolhimento e escolhas possíveis para uma vida mais saudável.",
  summary:
    "Nutricionista apaixonada por ciência, alimentação e pela forma como pequenas escolhas diárias podem transformar a saúde e a qualidade de vida. Meu trabalho busca traduzir conhecimento técnico em orientações acessíveis, possíveis e sustentáveis.",

  bio: "Nutricionista, com especialização em Engenharia de Alimentos. Atua com uma abordagem leve, técnica e possível para ajudar pessoas a construírem constância, melhorarem sua relação com a comida e alinharem nutrição, mente e movimento.",

  // Formações confirmadas no projeto (redação preservada — sem transformar
  // "Pós-graduação" em "especialista", para não alterar a afirmação profissional).
  formations: [
    "Bacharel em Nutrição",
    "Bacharel em Biomedicina",
    "Pós-graduação em Engenharia de Alimentos",
    "Pós-graduação em Estética",
  ],

  // Temas/áreas de conteúdo (frentes de trabalho — não são especialidades
  // clínicas formais). Descrições curtas e específicas.
  themes: [
    {
      title: "Comportamento alimentar",
      description:
        "Como emoções, rotina e ambiente influenciam a fome e as escolhas do dia a dia.",
    },
    {
      title: "Emagrecimento sustentável",
      description:
        "Estratégias possíveis para constância, sem dietas radicais nem efeito sanfona.",
    },
    {
      title: "Bem-Estar Nutricional",
      description:
        "Equilíbrio, energia e qualidade de vida construídos a partir da alimentação.",
    },
    {
      title: "Alimentação e movimento",
      description:
        "A relação entre comer bem e manter o corpo ativo, com leveza e sem radicalismos.",
    },
    {
      title: "Qualidade de vida",
      description:
        "Hábitos simples que sustentam saúde, disposição e bem-estar ao longo do tempo.",
    },
    {
      title: "Ciência aplicada à rotina",
      description:
        "Conhecimento técnico traduzido em orientações acessíveis e aplicáveis.",
    },
  ],

  // Modalidades de atendimento confirmadas. Informativo — não é fluxo de
  // agendamento nem CTA comercial. `label` é a forma pronta para exibição.
  attendance: {
    label: "Atendimento presencial e online",
    modes: ["Atendimento presencial", "Atendimento online"],
  },

  photoUrl: "/images/nutritionist/weverlyn.jpg",
  photoAlt: "Weverlyn Alves, nutricionista e autora do Nutrição & Movimento",

  instagramUrl: "https://www.instagram.com/nutri_lyn_weverlynalves",
  whatsappUrl: "https://wa.me/5521979762589",
  appointmentUrl: "https://wa.me/5521979762589",
};
