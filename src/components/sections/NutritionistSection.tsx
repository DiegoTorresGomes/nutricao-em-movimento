import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import Link from "next/link";
import { nutritionistConfig } from "@/config/nutritionist";
import type { NutritionistSettings } from "@/lib/site-settings";

type NutritionistSectionProps = {
  settings: NutritionistSettings;
};

export function NutritionistSection({ settings }: NutritionistSectionProps) {
  return (
    <section className="bg-[#111111] px-4 py-16 text-white sm:px-6 md:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
        <div className="rounded-[2rem] bg-[#E9DCC9] p-5">
          <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-[1.5rem] bg-white text-center text-sm font-bold uppercase tracking-[0.25em] text-[#556B2F]">
            {settings.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={settings.photoUrl}
                alt={nutritionistConfig.photoAlt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            ) : (
              "Foto profissional"
            )}
          </div>
        </div>

        <div>
          <SectionLabel dark>Sobre a nutricionista</SectionLabel>

          <h2 className="mt-5 text-3xl font-semibold sm:text-4xl md:text-5xl">
            <Link href={nutritionistConfig.authorPath} className="rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E9DCC9]">{nutritionistConfig.displayName}</Link>
          </h2>

          <p className="mt-3 text-sm font-bold uppercase tracking-[0.25em] text-[#E9DCC9]">
            {nutritionistConfig.jobTitle} • {nutritionistConfig.credential}
          </p>

          <p className="mt-6 max-w-2xl text-base leading-8 text-white/70">
            {nutritionistConfig.bio}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            {nutritionistConfig.themes.map(({ title: specialty }) => (
              <span
                key={specialty}
                className="rounded-full border border-white/15 px-4 py-2 text-xs font-bold text-white/80"
              >
                {specialty}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              href={settings.instagramUrl}
              external
              variant="outline"
              className="text-white hover:border-[#E9DCC9] hover:text-[#E9DCC9]"
            >
              Instagram
            </Button>

            <Button href={settings.whatsappUrl} external variant="olive">
              WhatsApp
            </Button>

            <Button href={settings.appointmentUrl} external variant="light">
              Agendar consulta
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
