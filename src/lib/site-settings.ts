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
  name: "Weverlyn da Cruz Alves Torres",
  crn: "CRN 24101524",
  role: "Nutricionista",
  bio: "Nutricionista formada pela Estácio de Sá, com especialização em Engenharia de Alimentos. Atua com uma abordagem leve, técnica e possível para ajudar pessoas a construírem constância, melhorarem sua relação com a comida e alinharem nutrição, mente e movimento.",
  instagramUrl: "https://www.instagram.com/nutri_lyn_weverlynalves",
  whatsappUrl: "https://wa.me/5521979762589",
  appointmentUrl: "https://wa.me/5521979762589",
  photoUrl: "/images/nutritionist/weverlyn.jpg",
  specialties: [
    "Engenharia de Alimentos",
    "Comportamento alimentar",
    "Emagrecimento sustentável",
    "Nutrição esportiva",
  ],
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