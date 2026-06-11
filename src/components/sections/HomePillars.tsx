import { SectionLabel } from "@/components/ui/SectionLabel";
import type { HomeSettings } from "@/lib/site-settings";

type HomePillarsProps = {
  settings: HomeSettings;
};

export function HomePillars({ settings }: HomePillarsProps) {
  return (
    <section className="border-y border-black/5 bg-[#FAF8F4] px-4 py-16 sm:px-6 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <SectionLabel>{settings.pillarsLabel}</SectionLabel>

          <h2 className="mt-5 text-3xl font-semibold sm:text-4xl md:text-5xl">
            {settings.pillarsTitle}
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {settings.pillars.map((pillar) => (
            <article
              key={pillar.title}
              className="rounded-[1.75rem] bg-white p-6 shadow-sm"
            >
              <h3 className="text-2xl font-semibold">{pillar.title}</h3>

              <p className="mt-4 text-sm leading-7 text-neutral-700">
                {pillar.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}