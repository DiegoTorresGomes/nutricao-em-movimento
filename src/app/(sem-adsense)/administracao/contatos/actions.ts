"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Allowlist de status validada no servidor (não confia no cliente).
const ALLOWED_STATUS = ["NEW", "READ", "ARCHIVED"] as const;
type ContactStatus = (typeof ALLOWED_STATUS)[number];

function isAllowed(value: string): value is ContactStatus {
  return (ALLOWED_STATUS as readonly string[]).includes(value);
}

export async function updateContactStatusAction(formData: FormData) {
  // Defense-in-depth: além do AdminLayout, a própria action exige sessão.
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");

  if (!id || !isAllowed(status)) {
    return;
  }

  await prisma.contactMessage.update({
    where: { id },
    data: {
      status,
      // readAt marca quando foi lida; limpa ao voltar para NEW.
      readAt: status === "READ" ? new Date() : status === "NEW" ? null : undefined,
    },
  });

  revalidatePath("/administracao/contatos");
  revalidatePath(`/administracao/contatos/${id}`);
}
