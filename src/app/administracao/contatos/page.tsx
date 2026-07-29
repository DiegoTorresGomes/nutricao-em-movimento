import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  FILTERS,
  STATUS_BADGE,
  STATUS_LABEL,
  statusFromFilter,
  type ContactStatus,
} from "./helpers";

type AdminContatosPageProps = {
  searchParams?: Promise<{ filter?: string }>;
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

export default async function AdminContatosPage({
  searchParams,
}: AdminContatosPageProps) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const params = await searchParams;
  const activeFilter = params?.filter ?? "todas";
  const status = statusFromFilter(activeFilter);

  const [messages, newCount] = await Promise.all([
    prisma.contactMessage.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: "desc" },
    }),
    prisma.contactMessage.count({ where: { status: "NEW" } }),
  ]);

  return (
    <AdminLayout>
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#556B2F]">
          Contatos
        </p>
        <h1 className="mt-3 text-3xl font-semibold">Mensagens recebidas</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Mensagens enviadas pelo formulário público de contato.
        </p>
      </div>

      <div className="mb-8 rounded-[2rem] bg-white p-6 shadow-sm">
        <p className="text-sm font-bold text-neutral-500">Novas mensagens</p>
        <p className="mt-2 text-5xl font-bold text-[#556B2F]">{newCount}</p>
      </div>

      {/* Filtros mínimos */}
      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map((filter) => {
          const active = filter.key === activeFilter;
          return (
            <Link
              key={filter.key}
              href={`/administracao/contatos?filter=${filter.key}`}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                active
                  ? "bg-[#111111] text-white"
                  : "bg-white text-neutral-600 shadow-sm hover:text-[#556B2F]"
              }`}
            >
              {filter.label}
            </Link>
          );
        })}
      </div>

      <div className="overflow-x-auto rounded-[2rem] bg-white shadow-sm">
        <table className="w-full min-w-[720px]">
          <thead className="border-b border-black/5 bg-[#FAF8F4]">
            <tr>
              {["Nome", "Assunto", "Mensagem", "Data", "Status"].map((h) => (
                <th
                  key={h}
                  className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.2em]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {messages.map((m) => {
              const st = m.status as ContactStatus;
              return (
                <tr key={m.id} className="border-b border-black/5 align-top">
                  <td className="px-6 py-4">
                    <Link
                      href={`/administracao/contatos/${m.id}`}
                      className="text-sm font-bold text-[#111111] underline-offset-4 hover:underline"
                    >
                      {m.name}
                    </Link>
                    <span className="mt-1 block text-xs text-neutral-500">
                      {m.email}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-700">
                    {m.subject ?? "—"}
                  </td>
                  <td className="max-w-[280px] px-6 py-4 text-sm text-neutral-600">
                    <span className="line-clamp-2">{m.message}</span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-600">
                    {dateFormatter.format(m.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_BADGE[st]}`}
                    >
                      {STATUS_LABEL[st]}
                    </span>
                  </td>
                </tr>
              );
            })}

            {messages.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-sm text-neutral-500"
                >
                  Nenhuma mensagem nesta categoria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
