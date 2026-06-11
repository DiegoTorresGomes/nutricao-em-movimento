import { AdminLayout } from "@/components/admin/AdminLayout";
import { getHomeSettings } from "@/lib/site-settings";
import { updateHomeSettingsAction } from "./actions";

type PageProps = {
  searchParams?: Promise<{
    sucesso?: string;
  }>;
};

export default async function AdminHomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const settings = await getHomeSettings();

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Home</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Edite os principais textos da página inicial do blog.
        </p>
      </div>

      {params?.sucesso === "1" && (
        <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-bold text-green-700">
          Home atualizada com sucesso.
        </div>
      )}

      <form action={updateHomeSettingsAction} className="grid gap-8">
        <section className="rounded-[2rem] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Hero principal</h2>

          <div className="mt-6 grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-bold">Etiqueta</label>
              <input
                name="heroLabel"
                defaultValue={settings.heroLabel}
                className="h-12 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-[#556B2F]"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-bold">Título principal</label>
              <textarea
                name="heroTitle"
                rows={2}
                defaultValue={settings.heroTitle}
                className="rounded-2xl border border-black/10 p-4 text-sm leading-7 outline-none focus:border-[#556B2F]"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-bold">Descrição</label>
              <textarea
                name="heroDescription"
                rows={4}
                defaultValue={settings.heroDescription}
                className="rounded-2xl border border-black/10 p-4 text-sm leading-7 outline-none focus:border-[#556B2F]"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                name="primaryButtonText"
                defaultValue={settings.primaryButtonText}
                className="h-12 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-[#556B2F]"
              />
              <input
                name="primaryButtonUrl"
                defaultValue={settings.primaryButtonUrl}
                className="h-12 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-[#556B2F]"
              />
              <input
                name="secondaryButtonText"
                defaultValue={settings.secondaryButtonText}
                className="h-12 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-[#556B2F]"
              />
              <input
                name="secondaryButtonUrl"
                defaultValue={settings.secondaryButtonUrl}
                className="h-12 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-[#556B2F]"
              />
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Card editorial</h2>

          <div className="mt-6 grid gap-4">
            <input
              name="editorialLabel"
              defaultValue={settings.editorialLabel}
              className="h-12 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-[#556B2F]"
            />
            <textarea
              name="editorialTitle"
              rows={2}
              defaultValue={settings.editorialTitle}
              className="rounded-2xl border border-black/10 p-4 text-sm leading-7 outline-none focus:border-[#556B2F]"
            />
            <textarea
              name="editorialDescription"
              rows={4}
              defaultValue={settings.editorialDescription}
              className="rounded-2xl border border-black/10 p-4 text-sm leading-7 outline-none focus:border-[#556B2F]"
            />

            <div className="grid gap-3 md:grid-cols-3">
              {settings.editorialPillars.map((pillar, index) => (
                <input
                  key={index}
                  name={`editorialPillar${index + 1}`}
                  defaultValue={pillar}
                  className="h-12 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-[#556B2F]"
                />
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Pilares</h2>

          <div className="mt-6 grid gap-4">
            <input
              name="pillarsLabel"
              defaultValue={settings.pillarsLabel}
              className="h-12 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-[#556B2F]"
            />

            <textarea
              name="pillarsTitle"
              rows={2}
              defaultValue={settings.pillarsTitle}
              className="rounded-2xl border border-black/10 p-4 text-sm leading-7 outline-none focus:border-[#556B2F]"
            />

            {settings.pillars.map((pillar, index) => (
              <div
                key={index}
                className="grid gap-3 rounded-2xl border border-black/10 p-4"
              >
                <input
                  name={`pillar${index + 1}Title`}
                  defaultValue={pillar.title}
                  className="h-12 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-[#556B2F]"
                />

                <textarea
                  name={`pillar${index + 1}Description`}
                  rows={3}
                  defaultValue={pillar.description}
                  className="rounded-2xl border border-black/10 p-4 text-sm leading-7 outline-none focus:border-[#556B2F]"
                />
              </div>
            ))}
          </div>
        </section>

        <button
          type="submit"
          className="w-fit cursor-pointer rounded-full bg-[#556B2F] px-7 py-3 text-sm font-bold !text-white transition hover:bg-[#465a28]"
        >
          Salvar Home
        </button>
      </form>
    </AdminLayout>
  );
}