"use client";

import { useEffect, useRef } from "react";

type ArticleViewCounterProps = {
  postId: string;
};

/**
 * Registers a view for an article from the client, after the page has mounted.
 *
 * Why a client effect instead of incrementing during render:
 *  - Server render must stay side-effect free (a write during render runs on
 *    every prerender/refresh and is an anti-pattern in Next.js 15).
 *  - Route prefetch fetches the RSC payload but never mounts this component,
 *    so hovering/prefetching a link does NOT count as a view.
 *  - A per-session guard (sessionStorage) prevents double counting from React
 *    Strict Mode's double-invoke and from back/forward navigation.
 */
export function ArticleViewCounter({ postId }: ArticleViewCounterProps) {
  const hasCounted = useRef(false);

  useEffect(() => {
    if (hasCounted.current) return;

    const storageKey = `viewed:${postId}`;

    try {
      if (sessionStorage.getItem(storageKey)) return;
      sessionStorage.setItem(storageKey, "1");
    } catch {
      // sessionStorage may be unavailable (private mode); still count once.
    }

    hasCounted.current = true;

    // keepalive lets the request complete even if the user navigates away.
    fetch(`/api/posts/${postId}/view`, {
      method: "POST",
      keepalive: true,
    }).catch(() => {
      // A failed view registration must never affect the reading experience.
    });
  }, [postId]);

  return null;
}
