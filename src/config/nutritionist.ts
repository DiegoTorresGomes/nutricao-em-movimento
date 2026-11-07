import { siteConfig } from "./site";

export const nutritionistConfig = {
  // Nome legal completo (usado em schema/autoria).
  name: "Weverlyn da Cruz Alves Torres",
  // Nome de apresentação pública.
  alternateName: "Weverlyn Alves",
  get displayName() { return this.alternateName; },
  jobTitle: "Nutricionista",
  get role() { return this.jobTitle; },
  // CRN é opcional: só é exibido quando presente. Nunca renderizar placeholder.
  credential: "CRN 24101524",
  get crn() { return this.credential; },
  authorPath: "/pt/autora/weverlyn-alves",
  // Conta técnica de publicação; autoria confirmada pela responsável pelo projeto.
  publishingAccountIds: ["cmq7a3h0x0000i8imbilojid6"],
  get authorUrl() { return `${siteConfig.url}${this.authorPath}`; },

  // Título editorial e resumo da página Sobre.
  headline: "Ciência, acolhimento e escolhas possíveis para uma vida mais saudável.",
  summary:
    "Nutricionista apaixonada por ciência, alimentação e pela forma como pequenas escolhas diárias podem transformar a saúde e a qualidade de vida. Meu trabalho busca traduzir conhecimento técnico em orientações acessíveis, possíveis e sustentáveis.",

  bio: "Weverlyn Alves é nutricionista, bacharel em Nutrição e em Biomedicina, com pós-graduação em Engenharia de Alimentos e em Estética. No Nutrição & Movimento, compartilha conteúdos educativos sobre alimentação, comportamento e qualidade de vida. Realiza atendimento presencial e online.",

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
      title: "Saúde baseada em evidências",
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

  // Canais e dados de contato confirmados. Fonte única — reutilizada pela
  // página Contato, Footer e Schema. `responseTime` centraliza o texto para
  // não ser duplicado em vários locais.
  contact: {
    email: "contato@nutricaoemovimento.com",
    phone: "+55 21 97976-2589",
    responseTime: "Até 24 horas úteis",
    // Mensagem inicial neutra do WhatsApp (sem dados pessoais na URL).
    whatsappMessage: "Olá, gostaria de informações sobre atendimento nutricional.",
  },

  photoUrl: "/images/nutritionist/weverlyn.jpg",
  photoAlt: "Weverlyn Alves, nutricionista e autora do Nutrição & Movimento",

  instagramUrl: "https://www.instagram.com/nutri_lyn_weverlynalves",
  whatsappUrl: "https://wa.me/5521979762589",
  appointmentUrl: "https://wa.me/5521979762589",
};

// A mesma entidade é reutilizada na Home, em Sobre e no perfil canônico.
export const nutritionistPersonSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${nutritionistConfig.authorUrl}#person`,
  name: nutritionistConfig.name,
  alternateName: nutritionistConfig.alternateName,
  jobTitle: nutritionistConfig.jobTitle,
  url: nutritionistConfig.authorUrl,
  image: new URL(nutritionistConfig.photoUrl, siteConfig.url).href,
  description: nutritionistConfig.bio,
  identifier: { "@type": "PropertyValue", propertyID: "CRN", value: nutritionistConfig.credential.replace(/^CRN\s+/, "") },
  sameAs: [nutritionistConfig.instagramUrl],
  knowsAbout: nutritionistConfig.themes.map(({ title }) => title),
};
