type EditorialDates = { publishedAt: Date | null; editorialUpdatedAt: Date | null };

// An absent editorial history is not evidence of a recent review.
export function articleModifiedAt(post: EditorialDates) {
  return post.editorialUpdatedAt ?? post.publishedAt ?? undefined;
}

export function originalPublishedAt(previous: Date | null, status: string, now: Date) {
  return previous ?? (status === "PUBLISHED" ? now : null);
}

export function hasEditorialChanges(
  previous: Record<string, unknown>,
  next: Record<string, unknown>,
) {
  return Object.keys(next).some((field) => (previous[field] ?? "") !== (next[field] ?? ""));
}
