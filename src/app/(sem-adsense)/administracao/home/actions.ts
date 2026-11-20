"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  defaultHomeSettings,
  saveHomeSettings,
  type HomeSettings,
} from "@/lib/site-settings";

export async function updateHomeSettingsAction(formData: FormData) {
  const settings: HomeSettings = {
    ...defaultHomeSettings,

    heroLabel: String(formData.get("heroLabel") || "").trim(),
    heroTitle: String(formData.get("heroTitle") || "").trim(),
    heroDescription: String(formData.get("heroDescription") || "").trim(),

    primaryButtonText: String(formData.get("primaryButtonText") || "").trim(),
    primaryButtonUrl: String(formData.get("primaryButtonUrl") || "").trim(),

    secondaryButtonText: String(formData.get("secondaryButtonText") || "").trim(),
    secondaryButtonUrl: String(formData.get("secondaryButtonUrl") || "").trim(),

    editorialLabel: String(formData.get("editorialLabel") || "").trim(),
    editorialTitle: String(formData.get("editorialTitle") || "").trim(),
    editorialDescription: String(
      formData.get("editorialDescription") || ""
    ).trim(),

    editorialPillars: [
      String(formData.get("editorialPillar1") || "").trim(),
      String(formData.get("editorialPillar2") || "").trim(),
      String(formData.get("editorialPillar3") || "").trim(),
    ].filter(Boolean),

    pillarsLabel: String(formData.get("pillarsLabel") || "").trim(),
    pillarsTitle: String(formData.get("pillarsTitle") || "").trim(),

    pillars: [
      {
        title: String(formData.get("pillar1Title") || "").trim(),
        description: String(formData.get("pillar1Description") || "").trim(),
      },
      {
        title: String(formData.get("pillar2Title") || "").trim(),
        description: String(formData.get("pillar2Description") || "").trim(),
      },
      {
        title: String(formData.get("pillar3Title") || "").trim(),
        description: String(formData.get("pillar3Description") || "").trim(),
      },
    ].filter((pillar) => pillar.title && pillar.description),
  };

  await saveHomeSettings(settings);

  revalidatePath("/pt");
  revalidatePath("/administracao/home");

  redirect("/administracao/home?sucesso=1");
}