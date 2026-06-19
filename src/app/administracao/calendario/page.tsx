import Link from "next/link";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { prisma } from "@/lib/prisma";
import { reschedulePostAction } from "./actions";

function formatDate(date: Date | null) {
  if (!date) return "Sem data";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getMonthDays(referenceDate: Date) {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const days = [];

  for (let day = 1; day <= lastDay.getDate(); day++) {
    days.push(new Date(year, month, day));
  }

  const startPadding = firstDay.getDay();

  return {
    days,
    startPadding,
    monthLabel: new Intl.DateTimeFormat("pt-BR", {
      month: "long",
      year: "numeric",
    }).format(referenceDate),
  };
}

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getWeekDays(referenceDate: Date) {
  const dayOfWeek = referenceDate.getDay();
  const startOfWeek = new Date(referenceDate);

  startOfWeek.setDate(referenceDate.getDate() - dayOfWeek);

  return Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + index);
    return date;
  });
}

type EditorialCalendarPageProps = {
  searchParams?: Promise<{
    month?: string;
    year?: string;
  }>;
};

export default async function EditorialCalendarPage({ searchParams }: EditorialCalendarPageProps) {
  const params = await searchParams;

  const currentDate = new Date();
  const selectedMonth = Number(params?.month ?? currentDate.getMonth() + 1);
  const selectedYear = Number(params?.year ?? currentDate.getFullYear());

  const calendarDate = new Date(selectedYear, selectedMonth - 1, 1);

  const previousMonthDate = new Date(selectedYear, selectedMonth - 2, 1);
  const nextMonthDate = new Date(selectedYear, selectedMonth, 1);

  const previousMonthHref = `/administracao/calendario?month=${
    previousMonthDate.getMonth() + 1
  }&year=${previousMonthDate.getFullYear()}`;

  const nextMonthHref = `/administracao/calendario?month=${
    nextMonthDate.getMonth() + 1
  }&year=${nextMonthDate.getFullYear()}`;

  const { days, startPadding, monthLabel } = getMonthDays(calendarDate);
  const weekDays = getWeekDays(currentDate);

  const posts = await prisma.post.findMany({
    where: {
      status: {
        in: ["SCHEDULED", "PUBLISHED", "REVIEW", "DRAFT"],
      },
    },
    include: {
      category: true,
    },
    orderBy: [
      {
        scheduledAt: "asc",
      },
      {
        publishedAt: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });

  const scheduledPosts = posts.filter((post) => post.scheduledAt);
  const withoutDatePosts = posts.filter((post) => !post.scheduledAt);
  const timelinePosts = posts
    .filter((post) => post.scheduledAt || post.publishedAt)
    .sort((a, b) => {
      const dateA = a.scheduledAt ?? a.publishedAt ?? a.createdAt;
      const dateB = b.scheduledAt ?? b.publishedAt ?? b.createdAt;

      return dateA.getTime() - dateB.getTime();
    });

  const postsByDay = scheduledPosts.reduce<Record<string, typeof scheduledPosts>>((acc, post) => {
    if (!post.scheduledAt) return acc;

    const key = dateKey(post.scheduledAt);

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(post);

    return acc;
  }, {});

  return (
    <AdminLayout>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-semibold">Calendário Editorial</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Visualize publicações agendadas, conteúdos em revisão e posts futuros.
          </p>
        </div>

        <Link
          href="/administracao/artigos/novo"
          className="w-fit rounded-full bg-[#111111] px-6 py-3 text-sm font-bold !text-white"
        >
          Novo artigo
        </Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="grid gap-6">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-semibold capitalize">{monthLabel}</h2>
                <p className="mt-1 text-sm text-neutral-500">
                  Dias ocupados aparecem destacados no calendário.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  href={previousMonthHref}
                  className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-bold transition hover:border-[#556B2F] hover:text-[#556B2F]"
                >
                  ← Mês anterior
                </Link>

                <Link
                  href={nextMonthHref}
                  className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-bold transition hover:border-[#556B2F] hover:text-[#556B2F]"
                >
                  Próximo mês →
                </Link>

                <span className="rounded-full bg-[#EEF6EA] px-4 py-2 text-xs font-bold text-[#556B2F]">
                  {scheduledPosts.length} agendado(s)
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-7 gap-2 text-center text-xs font-bold uppercase tracking-[0.15em] text-neutral-500">
              <div>Dom</div>
              <div>Seg</div>
              <div>Ter</div>
              <div>Qua</div>
              <div>Qui</div>
              <div>Sex</div>
              <div>Sáb</div>
            </div>

            <div className="mt-3 grid grid-cols-7 gap-2">
              {Array.from({ length: startPadding }).map((_, index) => (
                <div key={`empty-${index}`} className="min-h-[110px] rounded-2xl bg-[#FAF8F4]" />
              ))}

              {days.map((day) => {
                const key = dateKey(day);
                const dayPosts = postsByDay[key] || [];
                const hasPosts = dayPosts.length > 0;

                return (
                  <div
                    key={key}
                    className={`min-h-[110px] rounded-2xl border p-3 text-left transition ${
                      hasPosts ? "border-[#556B2F]/30 bg-[#EEF6EA]" : "border-black/5 bg-[#FAF8F4]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold">{day.getDate()}</span>

                      {hasPosts && (
                        <span className="rounded-full bg-[#556B2F] px-2 py-0.5 text-[10px] font-bold text-white">
                          {dayPosts.length}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 grid gap-2">
                      {dayPosts.slice(0, 2).map((post) => (
                        <Link
                          key={post.id}
                          href={`/administracao/artigos/${post.id}/editar`}
                          className="rounded-xl bg-white p-2 text-[11px] font-bold leading-4 shadow-sm transition hover:text-[#556B2F]"
                        >
                          {post.title}
                        </Link>
                      ))}

                      {dayPosts.length > 2 && (
                        <p className="text-[11px] font-bold text-[#556B2F]">
                          +{dayPosts.length - 2} outro(s)
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-semibold">Visualização semanal</h2>
                <p className="mt-1 text-sm text-neutral-500">
                  Acompanhe os conteúdos programados para a semana atual.
                </p>
              </div>

              <span className="rounded-full bg-[#FAF8F4] px-4 py-2 text-xs font-bold text-neutral-600">
                Semana atual
              </span>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-7">
              {weekDays.map((day) => {
                const key = dateKey(day);
                const dayPosts = postsByDay[key] || [];

                return (
                  <div
                    key={key}
                    className={`rounded-2xl border p-4 ${
                      dayPosts.length > 0
                        ? "border-[#556B2F]/30 bg-[#EEF6EA]"
                        : "border-black/5 bg-[#FAF8F4]"
                    }`}
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">
                      {new Intl.DateTimeFormat("pt-BR", {
                        weekday: "short",
                      }).format(day)}
                    </p>

                    <p className="mt-1 text-lg font-semibold">{day.getDate()}</p>

                    <div className="mt-4 grid gap-2">
                      {dayPosts.length === 0 && (
                        <p className="text-xs leading-5 text-neutral-500">Sem publicação.</p>
                      )}

                      {dayPosts.map((post) => (
                        <Link
                          key={post.id}
                          href={`/administracao/artigos/${post.id}/editar`}
                          className="rounded-xl bg-white p-2 text-[11px] font-bold leading-4 shadow-sm transition hover:text-[#556B2F]"
                        >
                          {post.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-semibold">Posts agendados</h2>
                <p className="mt-1 text-sm text-neutral-500">
                  Lista detalhada das publicações com data definida.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              {scheduledPosts.length === 0 && (
                <div className="rounded-2xl border border-dashed border-black/10 bg-[#FAF8F4] p-6 text-center text-sm text-neutral-500">
                  Nenhuma publicação agendada ainda.
                </div>
              )}

              {scheduledPosts.map((post) => (
                <div key={post.id} className="rounded-2xl border border-black/10 bg-[#FAF8F4] p-5">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#D67A5A]">
                        {post.category.name}
                      </p>

                      <h3 className="mt-2 text-lg font-semibold">{post.title}</h3>

                      <p className="mt-2 text-sm text-neutral-600">
                        Agendado para: <strong>{formatDate(post.scheduledAt)}</strong>
                      </p>
                    </div>

                    <span className="w-fit rounded-full bg-[#FFF8EE] px-3 py-1 text-xs font-bold text-[#8A5A00]">
                      {post.status}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-4">
                    <Link
                      href={`/administracao/artigos/${post.id}/editar`}
                      className="text-sm font-bold text-[#556B2F]"
                    >
                      Editar
                    </Link>

                    <Link
                      href={`/pt/artigos/${post.slug}`}
                      className="text-sm font-bold text-[#111111]"
                    >
                      Ver no site
                    </Link>
                  </div>

                  <form
                    action={reschedulePostAction}
                    className="mt-4 grid gap-3 rounded-2xl bg-white p-4"
                  >
                    <input type="hidden" name="postId" value={post.id} />

                    <label className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">
                      Reagendar publicação
                    </label>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <input
                        name="scheduledAt"
                        type="datetime-local"
                        defaultValue={
                          post.scheduledAt
                            ? new Date(post.scheduledAt).toISOString().slice(0, 16)
                            : ""
                        }
                        className="h-11 rounded-2xl border border-black/10 bg-[#FAF8F4] px-4 text-sm outline-none focus:border-[#556B2F]"
                      />

                      <button
                        type="submit"
                        className="rounded-full bg-[#556B2F] px-5 py-2.5 text-sm font-bold !text-white transition hover:bg-[#465a28]"
                      >
                        Reagendar
                      </button>
                    </div>
                  </form>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-semibold">Timeline editorial</h2>
                <p className="mt-1 text-sm text-neutral-500">
                  Visão cronológica dos conteúdos com data definida.
                </p>
              </div>

              <span className="rounded-full bg-[#FAF8F4] px-4 py-2 text-xs font-bold text-neutral-600">
                {timelinePosts.length} item(ns)
              </span>
            </div>

            <div className="mt-6 grid gap-4">
              {timelinePosts.length === 0 && (
                <div className="rounded-2xl border border-dashed border-black/10 bg-[#FAF8F4] p-6 text-center text-sm text-neutral-500">
                  Nenhum conteúdo com data para exibir na timeline.
                </div>
              )}

              {timelinePosts.map((post) => {
                const eventDate = post.scheduledAt ?? post.publishedAt ?? post.createdAt;

                return (
                  <div
                    key={post.id}
                    className="relative rounded-2xl border border-black/10 bg-[#FAF8F4] p-5 pl-8"
                  >
                    <span className="absolute left-4 top-6 h-3 w-3 rounded-full bg-[#556B2F]" />

                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#D67A5A]">
                      {formatDate(eventDate)}
                    </p>

                    <h3 className="mt-2 text-lg font-semibold">{post.title}</h3>

                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-neutral-600">
                        {post.category.name}
                      </span>

                      <span className="rounded-full bg-[#FFF8EE] px-3 py-1 text-xs font-bold text-[#8A5A00]">
                        {post.status}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-4">
                      <Link
                        href={`/administracao/artigos/${post.id}/editar`}
                        className="text-sm font-bold text-[#556B2F]"
                      >
                        Editar
                      </Link>

                      <Link
                        href={`/pt/artigos/${post.slug}`}
                        className="text-sm font-bold text-[#111111]"
                      >
                        Ver no site
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <aside className="rounded-[2rem] bg-white p-6 shadow-sm lg:sticky lg:top-6 lg:self-start">
          <h2 className="text-xl font-semibold">Sem data definida</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Rascunhos e revisões ainda sem agendamento.
          </p>

          <div className="mt-6 grid gap-3">
            {withoutDatePosts.length === 0 && (
              <p className="rounded-2xl bg-[#FAF8F4] p-4 text-sm text-neutral-500">
                Nenhum artigo pendente sem data.
              </p>
            )}

            {withoutDatePosts.map((post) => (
              <Link
                key={post.id}
                href={`/administracao/artigos/${post.id}/editar`}
                className="rounded-2xl border border-black/10 bg-[#FAF8F4] p-4 transition hover:border-[#556B2F]"
              >
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#D67A5A]">
                  {post.status}
                </p>
                <h3 className="mt-2 text-sm font-bold leading-6">{post.title}</h3>
                <p className="mt-2 text-xs text-neutral-500">{post.category.name}</p>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </AdminLayout>
  );
}
