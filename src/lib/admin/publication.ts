import {
  differenceInCalendarDays,
  format,
  isThisMonth,
  isThisWeek,
  isToday,
  isTomorrow,
  isYesterday,
} from "date-fns";
import { ptBR } from "date-fns/locale";

type PostLike = {
  status: string;
  publishedAt: Date | null;
  scheduledAt: Date | null;
  createdAt: Date;
};

export type PublicationKey = "published" | "scheduled" | "draft" | "nodate";

export type PublicationInfo = {
  key: PublicationKey;
  label: string;
  /** Tailwind background class for the status dot. */
  dotClass: string;
  /** Prefix such as "Publicado em:" / "Agendado para:" (null when not applicable). */
  prefix: string | null;
  /** Formatted "dd/MM/yyyy às HH:mm" or null. */
  datetime: string | null;
  /** Friendly relative indicator ("Publica em 2 dias", "Publicado há 3 dias"). */
  relative: string | null;
};

function formatDateTime(date: Date): string {
  return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
}

function formatTime(date: Date): string {
  return format(date, "HH:mm", { locale: ptBR });
}

function relativeScheduled(date: Date, now: Date): string {
  if (isToday(date)) return `Publica hoje às ${formatTime(date)}`;
  if (isTomorrow(date)) return `Publica amanhã às ${formatTime(date)}`;

  const days = differenceInCalendarDays(date, now);
  if (days < 0) return "Publicação pendente (atrasada)";
  return `Publica em ${days} dias`;
}

function relativePublished(date: Date, now: Date): string {
  if (isToday(date)) return `Publicado hoje às ${formatTime(date)}`;
  if (isYesterday(date)) return `Publicado ontem às ${formatTime(date)}`;

  const days = Math.abs(differenceInCalendarDays(date, now));
  return `Publicado há ${days} dias`;
}

export function getPublicationInfo(post: PostLike, now: Date = new Date()): PublicationInfo {
  if (post.status === "PUBLISHED" && post.publishedAt) {
    return {
      key: "published",
      label: "Publicado",
      dotClass: "bg-green-500",
      prefix: "Publicado em:",
      datetime: formatDateTime(post.publishedAt),
      relative: relativePublished(post.publishedAt, now),
    };
  }

  if (post.status === "SCHEDULED" && post.scheduledAt) {
    return {
      key: "scheduled",
      label: "Agendado",
      dotClass: "bg-amber-400",
      prefix: "Agendado para:",
      datetime: formatDateTime(post.scheduledAt),
      relative: relativeScheduled(post.scheduledAt, now),
    };
  }

  if (post.status === "DRAFT" || post.status === "REVIEW") {
    return {
      key: "draft",
      label: post.status === "REVIEW" ? "Em revisão" : "Rascunho",
      dotClass: "bg-neutral-300",
      prefix: null,
      datetime: null,
      relative: null,
    };
  }

  // Scheduled without a date, archived, or any other case.
  return {
    key: "nodate",
    label: "Sem data definida",
    dotClass: "bg-blue-500",
    prefix: null,
    datetime: null,
    relative: null,
  };
}

const GROUP_ORDER: Record<PublicationKey, number> = {
  scheduled: 0,
  draft: 1,
  published: 2,
  nodate: 3,
};

/**
 * Editorial ordering: upcoming scheduled first (nearest publish date), then
 * drafts, then most-recently published, then everything else.
 */
export function sortForAdmin<T extends PostLike>(posts: T[]): T[] {
  return [...posts].sort((a, b) => {
    const infoA = getPublicationInfo(a);
    const infoB = getPublicationInfo(b);

    if (infoA.key !== infoB.key) {
      return GROUP_ORDER[infoA.key] - GROUP_ORDER[infoB.key];
    }

    if (infoA.key === "scheduled") {
      // Nearest scheduled date first.
      return (a.scheduledAt?.getTime() ?? 0) - (b.scheduledAt?.getTime() ?? 0);
    }

    if (infoA.key === "published") {
      // Most recently published first.
      return (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0);
    }

    // Drafts / others: newest first.
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
}

export type PublicationSummary = {
  scheduledToday: number;
  scheduledThisWeek: number;
  scheduledThisMonth: number;
  published: number;
  drafts: number;
};

export function buildPublicationSummary(posts: PostLike[]): PublicationSummary {
  const summary: PublicationSummary = {
    scheduledToday: 0,
    scheduledThisWeek: 0,
    scheduledThisMonth: 0,
    published: 0,
    drafts: 0,
  };

  for (const post of posts) {
    if (post.status === "PUBLISHED") {
      summary.published += 1;
    } else if (post.status === "DRAFT" || post.status === "REVIEW") {
      summary.drafts += 1;
    }

    if (post.status === "SCHEDULED" && post.scheduledAt) {
      if (isToday(post.scheduledAt)) summary.scheduledToday += 1;
      if (isThisWeek(post.scheduledAt, { weekStartsOn: 1 })) summary.scheduledThisWeek += 1;
      if (isThisMonth(post.scheduledAt)) summary.scheduledThisMonth += 1;
    }
  }

  return summary;
}
