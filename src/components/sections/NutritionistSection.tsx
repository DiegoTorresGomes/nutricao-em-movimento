import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
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
                alt={settings.name}
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
            {settings.name}
          </h2>

          <p className="mt-3 text-sm font-bold uppercase tracking-[0.25em] text-[#E9DCC9]">
            {settings.role} • {settings.crn}
          </p>

          <p className="mt-6 max-w-2xl text-base leading-8 text-white/70">
            {settings.bio}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            {settings.specialties.map((specialty) => (
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