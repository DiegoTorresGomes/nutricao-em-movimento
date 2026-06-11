import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import type { HomeSettings } from "@/lib/site-settings";

type HomeHeroProps = {
  settings: HomeSettings;
};

export function HomeHero({ settings }: HomeHeroProps) {
  return (
    <section className="mx-auto grid min-h-[calc(100vh-64px)] max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 md:py-20 lg:min-h-[calc(100vh-80px)] lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
      <div>
        <SectionLabel>{settings.heroLabel}</SectionLabel>

        <h1 className="mt-5 max-w-5xl text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
          {settings.heroTitle}
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-8 text-neutral-700 sm:text-lg">
          {settings.heroDescription}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button href={settings.primaryButtonUrl}>
            {settings.primaryButtonText}
          </Button>

          <Button href={settings.secondaryButtonUrl} variant="outline">
            {settings.secondaryButtonText}
          </Button>
        </div>
      </div>

      <div className="rounded-[2rem] bg-[#E9DCC9] p-4 sm:p-5">
        <div className="rounded-[1.5rem] bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#D67A5A] sm:text-sm">
            {settings.editorialLabel}
          </p>

          <h2 className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl">
            {settings.editorialTitle}
          </h2>

          <p className="mt-5 text-sm leading-7 text-neutral-700 sm:text-base">
            {settings.editorialDescription}
          </p>

          <div className="mt-8 grid gap-3">
            {settings.editorialPillars.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-black/5 bg-[#FAF8F4] px-5 py-4 text-sm font-bold"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}