import { nutritionistConfig } from "@/config/nutritionist";
import { prisma } from "@/lib/prisma";

export type NutritionistSettings = {
  name: string;
  crn: string;
  role: string;
  bio: string;
  instagramUrl: string;
  whatsappUrl: string;
  appointmentUrl: string;
  photoUrl: string;
  specialties: string[];
};

export const defaultNutritionistSettings: NutritionistSettings = {
  name: nutritionistConfig.name,
  crn: nutritionistConfig.credential,
  role: nutritionistConfig.jobTitle,
  bio: nutritionistConfig.bio,
  instagramUrl: nutritionistConfig.instagramUrl,
  whatsappUrl: nutritionistConfig.whatsappUrl,
  appointmentUrl: nutritionistConfig.appointmentUrl,
  photoUrl: nutritionistConfig.photoUrl,
  specialties: nutritionistConfig.themes.map(({ title }) => title),
};

export async function getNutritionistSettings() {
  const setting = await prisma.siteSetting.findUnique({
    where: {
      key: "nutritionist",
    },
  });

  if (!setting) {
    return defaultNutritionistSettings;
  }

  return JSON.parse(setting.value) as NutritionistSettings;
}

export async function saveNutritionistSettings(data: NutritionistSettings) {
  return prisma.siteSetting.upsert({
    where: {
      key: "nutritionist",
    },
    update: {
      value: JSON.stringify(data),
    },
    create: {
      key: "nutritionist",
      value: JSON.stringify(data),
    },
  });
}

export type HomeSettings = {
  heroLabel: string;
  heroTitle: string;
  heroDescription: string;
  primaryButtonText: string;
  primaryButtonUrl: string;
  secondaryButtonText: string;
  secondaryButtonUrl: string;
  editorialLabel: string;
  editorialTitle: string;
  editorialDescription: string;
  editorialPillars: string[];
  pillarsLabel: string;
  pillarsTitle: string;
  pillars: {
    title: string;
    description: string;
  }[];
};

export const defaultHomeSettings: HomeSettings = {
  heroLabel: "Nutrição & Movimento",
  heroTitle: "Nutrição real para uma vida em movimento.",
  heroDescription:
    "Corpo ativo, mente alinhada, vida em construção. Conteúdos sobre comportamento alimentar, emagrecimento sustentável e Bem-Estar Nutricional para quem busca saúde, constância e equilíbrio sem radicalismos.",
  primaryButtonText: "Ler artigos",
  primaryButtonUrl: "/pt/artigos",
  secondaryButtonText: "Conhecer a nutricionista",
  secondaryButtonUrl: "/pt/sobre",
  editorialLabel: "Editorial premium",
  editorialTitle: "Clareza, constância e movimento.",
  editorialDescription:
    "Um blog construído para unir ciência, comportamento alimentar e estilo de vida em uma experiência leve, elegante e confiável.",
  editorialPillars: [
    "Comportamento alimentar",
    "Emagrecimento sustentável",
    "Bem-Estar Nutricional",
  ],
  pillarsLabel: "Pilares",
  pillarsTitle:
    "Conteúdo para quem quer sair do ciclo da culpa e construir constância.",
  pillars: [
    {
      title: "Comportamento alimentar",
      description:
        "Clareza para entender fome, emoções, escolhas e hábitos sem culpa ou radicalismo.",
    },
    {
      title: "Emagrecimento sustentável",
      description:
        "Estratégias possíveis para construir resultados consistentes sem efeito sanfona.",
    },
    {
      title: "Bem-Estar Nutricional",
      description:
        "Alimentação que sustenta energia, equilíbrio e qualidade de vida no dia a dia.",
    },
  ],
};

export async function getHomeSettings() {
  const setting = await prisma.siteSetting.findUnique({
    where: {
      key: "home",
    },
  });

  if (!setting) {
    return defaultHomeSettings;
  }

  return JSON.parse(setting.value) as HomeSettings;
}

export async function saveHomeSettings(data: HomeSettings) {
  return prisma.siteSetting.upsert({
    where: {
      key: "home",
    },
    update: {
      value: JSON.stringify(data),
    },
    create: {
      key: "home",
      value: JSON.stringify(data),
    },
  });
}
