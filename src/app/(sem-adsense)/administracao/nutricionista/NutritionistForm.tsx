"use client";

import { useState } from "react";
import type { NutritionistSettings } from "@/lib/site-settings";
import { updateNutritionistAction } from "./actions";

type NutritionistFormProps = {
  settings: NutritionistSettings;
};

export function NutritionistForm({ settings }: NutritionistFormProps) {
  const [photoUrl, setPhotoUrl] = useState(settings.photoUrl);
  const [isUploading, setIsUploading] = useState(false);

  async function handlePhotoUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "nutricao-em-movimento/nutritionist");

    const response = await fetch("/api/upload/image", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.url) {
      setPhotoUrl(data.url);
    } else {
      alert(data.error || "Erro ao enviar imagem.");
    }

    setIsUploading(false);
  }

  return (
    <form action={updateNutritionistAction} className="grid gap-6 rounded-[2rem] bg-white p-6 shadow-sm">
      <input type="hidden" name="photoUrl" value={photoUrl} />

      <div className="grid gap-4 md:grid-cols-[220px_1fr]">
        <div>
          <div className="aspect-[4/5] overflow-hidden rounded-[2rem] bg-[#E9DCC9]">
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoUrl}
                alt={settings.name}
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>

          <label className="mt-4 inline-flex cursor-pointer rounded-full bg-[#111111] px-5 py-3 text-sm font-bold !text-white transition hover:bg-[#556B2F]">
            {isUploading ? "Enviando..." : "Trocar foto"}
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
              disabled={isUploading}
            />
          </label>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-bold">Nome</label>
            <input
              name="name"
              defaultValue={settings.name}
              className="h-12 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-[#556B2F]"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-bold">CRN</label>
            <input
              name="crn"
              defaultValue={settings.crn}
              className="h-12 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-[#556B2F]"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-bold">Título profissional</label>
            <input
              name="role"
              defaultValue={settings.role}
              className="h-12 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-[#556B2F]"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-bold">Biografia</label>
        <textarea
          name="bio"
          rows={6}
          defaultValue={settings.bio}
          className="rounded-2xl border border-black/10 p-4 text-sm leading-7 outline-none focus:border-[#556B2F]"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-bold">Especialidades</label>
        <textarea
          name="specialties"
          rows={5}
          defaultValue={settings.specialties.join("\n")}
          className="rounded-2xl border border-black/10 p-4 text-sm leading-7 outline-none focus:border-[#556B2F]"
        />
        <p className="text-xs text-neutral-500">Digite uma especialidade por linha.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <label className="text-sm font-bold">Instagram</label>
          <input
            name="instagramUrl"
            defaultValue={settings.instagramUrl}
            className="h-12 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-[#556B2F]"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-bold">WhatsApp</label>
          <input
            name="whatsappUrl"
            defaultValue={settings.whatsappUrl}
            className="h-12 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-[#556B2F]"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-bold">Link de agendamento</label>
        <input
          name="appointmentUrl"
          defaultValue={settings.appointmentUrl}
          className="h-12 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-[#556B2F]"
        />
      </div>

      <button
        type="submit"
        className="w-fit rounded-full bg-[#556B2F] px-7 py-3 text-sm font-bold !text-white transition hover:bg-[#465a28]"
      >
        Salvar informações
      </button>
    </form>
  );
}