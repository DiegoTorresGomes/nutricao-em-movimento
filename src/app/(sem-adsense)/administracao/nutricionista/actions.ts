"use server";

import { redirect } from "next/navigation";
import { saveNutritionistSettings } from "@/lib/site-settings";

export async function updateNutritionistAction(formData: FormData) {
  const specialtiesText = String(formData.get("specialties") || "");

  await saveNutritionistSettings({
    name: String(formData.get("name") || ""),
    crn: String(formData.get("crn") || ""),
    role: String(formData.get("role") || ""),
    bio: String(formData.get("bio") || ""),
    instagramUrl: String(formData.get("instagramUrl") || ""),
    whatsappUrl: String(formData.get("whatsappUrl") || ""),
    appointmentUrl: String(formData.get("appointmentUrl") || ""),
    photoUrl: String(formData.get("photoUrl") || ""),
    specialties: specialtiesText
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean),
  });

  redirect("/administracao/nutricionista?salvo=1");
}