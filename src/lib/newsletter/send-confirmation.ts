type SendConfirmationParams = {
  email: string;
  token: string;
};

function getBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://nutricaoemovimento.com"
  );
}

export function buildConfirmationUrl(token: string): string {
  return `${getBaseUrl()}/api/newsletter/confirm?token=${encodeURIComponent(token)}`;
}

/**
 * Sends the Double Opt-in confirmation e-mail.
 *
 * ⚠️ INTEGRATION POINT — no e-mail provider is configured yet, so this does NOT
 * send anything (nothing is delivered and no data leaves the server before the
 * provider is wired). In development it logs the confirmation link so the flow
 * can be tested end-to-end.
 *
 * To activate (see docs/analytics-and-consent.md):
 *   1. Add a provider dependency (e.g. `resend`, `nodemailer`, AWS SES SDK).
 *   2. Add its credentials to `.env` (e.g. RESEND_API_KEY, or SMTP_* vars).
 *   3. Replace the TODO block below with the real send call, delivering
 *      `confirmationUrl` to `email` in a branded template.
 */
export async function sendConfirmationEmail({
  email,
  token,
}: SendConfirmationParams): Promise<void> {
  const confirmationUrl = buildConfirmationUrl(token);

  if (process.env.NODE_ENV !== "production") {
    console.info(
      `[newsletter] Link de confirmação para ${email}: ${confirmationUrl}`
    );
  }

  // TODO(provider): send the confirmation e-mail. Example with Resend:
  //
  //   const resend = new Resend(process.env.RESEND_API_KEY);
  //   await resend.emails.send({
  //     from: "Nutrição & Movimento <newsletter@nutricaoemovimento.com>",
  //     to: email,
  //     subject: "Confirme sua inscrição na newsletter",
  //     html: `<p>Confirme sua inscrição:</p><p><a href="${confirmationUrl}">Confirmar</a></p>`,
  //   });
  //
  // Until then, this is intentionally a no-op so the site can ship without an
  // active e-mail integration.
  return;
}
