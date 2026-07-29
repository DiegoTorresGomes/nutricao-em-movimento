import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateContactStatusAction } from "../actions";
import {
  STATUS_BADGE,
  STATUS_LABEL,
  toWhatsappHref,
  type ContactStatus,
} from "../helpers";

type MessagePageProps = {
  params: Promise<{ id: string }>;
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
  timeStyle: "short",
});

function StatusButton({
  id,
  status,
  label,
  variant = "neutral",
}: {
  id: string;
  status: ContactStatus;
  label: string;
  variant?: "neutral" | "dark";
}) {
  return (
    <form action={updateContactStatusAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <button
        type="submit"
        className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
          variant === "dark"
            ? "bg-[#111111] text-white hover:bg-[#556B2F]"
            : "border border-black/10 bg-white text-[#111111] hover:border-[#556B2F] hover:text-[#556B2F]"
        }`}
      >
        {label}
      </button>
    </form>
  );
}

export default async function AdminContatoMessagePage({
  params,
}: MessagePageProps) {
  // Auth antes de qualquer consulta: não expõe existência de registros nem
  // dados pessoais a requisições não autenticadas.
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const { id } = await params;

  const message = await prisma.contactMessage.findUnique({ where: { id } });

  if (!message) {
    notFound();
  }

  const status = message.status as ContactStatus;
  const whatsappHref = toWhatsappHref(message.phone);
  const mailtoHref = `mailto:${message.email}?subject=${encodeURIComponent(
    `Re: ${message.subject ?? "seu contato"}`,
  )}`;

  return (
    <AdminLayout>
      <div className="mb-6">
        <Link
          href="/administracao/contatos"
          className="text-sm font-bold text-[#556B2F] underline-offset-4 hover:underline"
        >
          ← Voltar para mensagens
        </Link>
      </div>

      <div className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{message.name}</h1>
            <p className="mt-1 text-sm text-neutral-600">{message.email}</p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_BADGE[status]}`}
          >
            {STATUS_LABEL[status]}
          </span>
        </div>

        <dl className="mt-6 grid gap-4 border-t border-black/5 pt-6 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">
              Assunto
            </dt>
            <dd className="mt-1 text-sm font-semibold text-[#111111]">
              {message.subject ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">
              Telefone
            </dt>
            <dd className="mt-1 text-sm font-semibold text-[#111111]">
              {message.phone ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">
              Recebida em
            </dt>
            <dd className="mt-1 text-sm font-semibold text-[#111111]">
              {dateFormatter.format(message.createdAt)}
            </dd>
          </div>
          {message.readAt ? (
            <div>
              <dt className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">
                Lida em
              </dt>
              <dd className="mt-1 text-sm font-semibold text-[#111111]">
                {dateFormatter.format(message.readAt)}
              </dd>
            </div>
          ) : null}
        </dl>

        {/* Mensagem tratada como TEXTO — sem renderizar HTML do usuário.
            whitespace-pre-wrap preserva as quebras de linha com segurança. */}
        <div className="mt-6 border-t border-black/5 pt-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">
            Mensagem
          </p>
          <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-neutral-800">
            {message.message}
          </p>
        </div>

        {/* Links úteis */}
        <div className="mt-6 flex flex-wrap gap-3 border-t border-black/5 pt-6">
          <a
            href={mailtoHref}
            className="rounded-full bg-[#556B2F] px-5 py-2.5 text-sm font-bold !text-white transition hover:bg-[#465a28]"
          >
            Responder por e-mail
          </a>
          {whatsappHref ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-bold text-[#111111] transition hover:border-[#556B2F] hover:text-[#556B2F]"
            >
              Abrir WhatsApp
            </a>
          ) : null}
        </div>

        {/* Ações de status */}
        <div className="mt-6 flex flex-wrap gap-3 border-t border-black/5 pt-6">
          {status !== "READ" ? (
            <StatusButton id={message.id} status="READ" label="Marcar como lida" variant="dark" />
          ) : (
            <StatusButton id={message.id} status="NEW" label="Marcar como não lida" />
          )}

          {status !== "ARCHIVED" ? (
            <StatusButton id={message.id} status="ARCHIVED" label="Arquivar" />
          ) : (
            <StatusButton id={message.id} status="READ" label="Restaurar" />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
