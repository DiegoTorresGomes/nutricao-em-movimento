import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  CONSENT_VERSION,
  COOKIES_POLICY_VERSION,
  PRIVACY_POLICY_VERSION,
} from "@/config/legal";

// Confirmation endpoint for the newsletter Double Opt-in. The link in the
// confirmation e-mail points here (/api/newsletter/confirm?token=...).
//
// Guarantees:
//  - Expiration: a token past confirmationExpiresAt is rejected.
//  - Single use / reuse protection: the token is cleared on success, and the
//    update is atomic (guarded by the token), so a replayed or concurrent
//    request finds nothing to update.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  const redirectTo = (status: string) =>
    NextResponse.redirect(new URL(`/pt?newsletter=${status}#newsletter`, url.origin));

  if (!token) {
    return redirectTo("erro");
  }

  const subscriber = await prisma.newsletterSubscriber.findUnique({
    where: { confirmationToken: token },
  });

  // Not found means the token is invalid or was already used (cleared).
  if (!subscriber) {
    return redirectTo("erro");
  }

  // Expired link.
  if (subscriber.confirmationExpiresAt && subscriber.confirmationExpiresAt.getTime() < Date.now()) {
    return redirectTo("expirado");
  }

  // Atomic confirm: the token in the WHERE clause guarantees only the first
  // request wins; a concurrent/replayed request updates 0 rows. This is also
  // the moment the LGPD consent audit trail is recorded.
  const now = new Date();
  const result = await prisma.newsletterSubscriber.updateMany({
    where: {
      id: subscriber.id,
      confirmationToken: token,
    },
    data: {
      status: "CONFIRMED",
      active: true,
      confirmedAt: now,
      confirmationToken: null,
      confirmationExpiresAt: null,
      consentVersion: CONSENT_VERSION,
      consentAcceptedAt: now,
      privacyPolicyVersion: PRIVACY_POLICY_VERSION,
      cookiesPolicyVersion: COOKIES_POLICY_VERSION,
      userAgent: request.headers.get("user-agent"),
    },
  });

  if (result.count === 0) {
    return redirectTo("erro");
  }

  revalidatePath("/administracao/newsletter");

  return redirectTo("confirmado");
}
