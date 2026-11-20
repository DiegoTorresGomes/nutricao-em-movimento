import { AdminLayout } from "@/components/admin/AdminLayout";
import { prisma } from "@/lib/prisma";

export default async function AdminNewsletterPage() {
  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalSubscribers = subscribers.length;

  return (
    <AdminLayout>
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#556B2F]">Newsletter</p>

        <h1 className="mt-3 text-3xl font-semibold">Inscritos</h1>

        <p className="mt-2 text-sm text-neutral-600">
          Pessoas cadastradas para receber conteúdos do blog.
        </p>
      </div>

      <div className="mb-8 rounded-[2rem] bg-white p-6 shadow-sm">
        <p className="text-sm font-bold text-neutral-500">Total de inscritos</p>

        <p className="mt-2 text-5xl font-bold text-[#556B2F]">{totalSubscribers}</p>
      </div>

      <div className="mb-8 flex justify-end">
        <a
          href="/api/admin/newsletter/export"
          className="rounded-full bg-[#111111] px-5 py-3 text-sm font-bold !text-white transition hover:bg-[#556B2F]"
        >
          Exportar CSV
        </a>
      </div>

      <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
        <table className="w-full">
          <thead className="border-b border-black/5 bg-[#FAF8F4]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.2em]">
                E-mail
              </th>

              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.2em]">
                Data
              </th>

              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.2em]">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {subscribers.map((subscriber) => (
              <tr key={subscriber.id} className="border-b border-black/5">
                <td className="px-6 py-4 text-sm">{subscriber.email}</td>

                <td className="px-6 py-4 text-sm">
                  {new Intl.DateTimeFormat("pt-BR").format(subscriber.createdAt)}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      subscriber.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {subscriber.active ? "Ativo" : "Inativo"}
                  </span>
                </td>
              </tr>
            ))}

            {subscribers.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-center text-sm text-neutral-500">
                  Nenhum inscrito encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
