"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  createSession,
  destroyTwoFactorChallenge,
  getTwoFactorChallenge,
} from "@/lib/auth";
import { verifyTwoFactorToken } from "@/lib/two-factor";

export async function verifyTwoFactorAction(formData: FormData) {
  const token = String(formData.get("token") || "").trim();
  const challenge = await getTwoFactorChallenge();

  if (!challenge) {
    redirect("/login?erro=sessao");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: challenge.userId,
    },
  });

  if (!user || !user.twoFactorSecret) {
    redirect("/login?erro=credenciais");
  }

  const isValid = verifyTwoFactorToken(token, user.twoFactorSecret);

  if (!isValid) {
    redirect("/login/2fa?erro=token");
  }

  await destroyTwoFactorChallenge();

  await createSession({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  redirect("/administracao");
}