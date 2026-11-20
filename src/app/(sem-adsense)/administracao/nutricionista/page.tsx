import { AdminLayout } from "@/components/admin/AdminLayout";
import { getNutritionistSettings } from "@/lib/site-settings";
import { NutritionistForm } from "./NutritionistForm";

export default async function AdminNutritionistPage() {
  const settings = await getNutritionistSettings();

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Nutricionista</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Edite as informações profissionais exibidas no site.
        </p>
      </div>

      <NutritionistForm settings={settings} />
    </AdminLayout>
  );
}