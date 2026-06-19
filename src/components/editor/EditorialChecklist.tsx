import type { ValidationGroup } from "@/lib/editor/validate-post";

type EditorialChecklistProps = {
  overallScore: number;
  canPublish: boolean;
  missingRequired: string[];
  groups: ValidationGroup[];
};

export function EditorialChecklist({
  overallScore,
  canPublish,
  missingRequired,
  groups,
}: EditorialChecklistProps) {
  const scoreColor =
    overallScore >= 80
      ? "bg-[#556B2F]"
      : overallScore >= 50
        ? "bg-[#D67A5A]"
        : "bg-red-600";

  return (
    <aside className="rounded-[2rem] border border-black/10 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Checklist editorial</h3>
          <p className="mt-1 text-xs leading-5 text-neutral-500">
            Validação automática antes da publicação.
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            canPublish
              ? "bg-[#EEF6EA] text-[#556B2F]"
              : "bg-red-50 text-red-700"
          }`}
        >
          {canPublish ? "Liberado" : "Pendente"}
        </span>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-sm font-bold">
          <span>Qualidade do artigo</span>
          <span>{overallScore}%</span>
        </div>

        <div className="mt-2 h-3 overflow-hidden rounded-full bg-neutral-100">
          <div
            className={`h-full rounded-full ${scoreColor}`}
            style={{ width: `${overallScore}%` }}
          />
        </div>
      </div>

      {missingRequired.length > 0 && (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-bold text-red-700">
            Faltam {missingRequired.length} itens obrigatórios:
          </p>

          <ul className="mt-3 grid gap-2 text-xs leading-5 text-red-700">
            {missingRequired.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-5 grid gap-4">
        {groups.map((group) => (
          <div key={group.title} className="rounded-2xl border border-black/10 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-bold">{group.title}</p>
              <span className="text-xs font-bold text-neutral-500">
                {group.score}%
              </span>
            </div>

            <div className="grid gap-2">
              {group.items.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-2 text-xs leading-5"
                >
                  <span>{item.ok ? "✅" : item.required ? "❌" : "⚠️"}</span>

                  <div>
                    <p
                      className={
                        item.ok
                          ? "font-bold text-[#556B2F]"
                          : item.required
                            ? "font-bold text-red-700"
                            : "font-bold text-[#D67A5A]"
                      }
                    >
                      {item.label}
                    </p>

                    {!item.ok && item.message && (
                      <p className="mt-0.5 text-neutral-500">{item.message}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}