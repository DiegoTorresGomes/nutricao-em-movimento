"use server";

import { randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { sendConfirmationEmail } from "@/lib/newsletter/send-confirmation";

// Confirmation links are valid for 24 hours.
const CONFIRMATION_TTL_MS = 24 * 60 * 60 * 1000;
// Per-IP throttle: at most 5 subscribe attempts every 10 minutes.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

async function getClientIp(): Promise<string | null> {
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? null;
  }
  return headersList.get("x-real-ip");
}

export async function subscribeNewsletterAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();

  if (!email || !email.includes("@")) {
    redirect("/pt?newsletter=erro#newsletter");
  }

  const ipAddress = await getClientIp();

  // Throttle abusive/automated submissions. When the limit is exceeded we show
  // the SAME neutral response as a success, so it reveals nothing.
  const { allowed } = rateLimit(`newsletter:${ipAddress ?? "unknown"}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!allowed) {
    redirect("/pt?newsletter=confirmar#newsletter");
  }

  const existing = await prisma.newsletterSubscriber.findUnique({
    where: { email },
  });

  // Anti-enumeration: never disclose whether an e-mail is already subscribed.
  // For an already-confirmed subscriber we simply do nothing (must NOT reset an
  // active subscriber to PENDING) and return the same neutral message.
  if (existing && existing.status === "CONFIRMED" && existing.active) {
    redirect("/pt?newsletter=confirmar#newsletter");
  }

  // Double Opt-in: (re)issue a single valid token with an expiry and store the
  // consent metadata (IP + timestamp). Re-subscribing overwrites the token, so
  // only the most recent confirmation link ever works — older links are void.
  //
  // High-entropy token (48 random bytes → base64url), the standard for e-mail
  // confirmation / password-reset links: unguessable and URL-safe.
  const token = randomBytes(48).toString("base64url");
  const confirmationExpiresAt = new Date(Date.now() + CONFIRMATION_TTL_MS);

  await prisma.newsletterSubscriber.upsert({
    where: { email },
    update: {
      status: "PENDING",
      active: false,
      confirmationToken: token,
      confirmationExpiresAt,
      ipAddress,
    },
    create: {
      email,
      status: "PENDING",
      active: false,
      confirmationToken: token,
      confirmationExpiresAt,
      ipAddress,
    },
  });

  await sendConfirmationEmail({ email, token });

  redirect("/pt?newsletter=confirmar#newsletter");
}
