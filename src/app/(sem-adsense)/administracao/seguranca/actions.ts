"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyTwoFactorToken } from "@/lib/two-factor";

export async function enableTwoFactorAction(formData: FormData) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const token = String(formData.get("token") || "").trim();
  const secret = String(formData.get("secret") || "").trim();

  if (!token || !secret) {
    redirect("/administracao/seguranca?erro=campos");
  }

  const isValid = verifyTwoFactorToken(token, secret);

  if (!isValid) {
    redirect("/administracao/seguranca?erro=token");
  }

  await prisma.user.update({
    where: {
      id: session.userId,
    },
    data: {
      twoFactorEnabled: true,
      twoFactorSecret: secret,
    },
  });

  revalidatePath("/administracao/seguranca");

  redirect("/administracao/seguranca?sucesso=ativado");
}

export async function disableTwoFactorAction() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  await prisma.user.update({
    where: {
      id: session.userId,
    },
    data: {
      twoFactorEnabled: false,
      twoFactorSecret: null,
    },
  });

  revalidatePath("/administracao/seguranca");

  redirect("/administracao/seguranca?sucesso=desativado");
}