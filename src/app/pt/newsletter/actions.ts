"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function subscribeNewsletterAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();

  if (!email || !email.includes("@")) {
    redirect("/pt?newsletter=erro#newsletter");
  }

  await prisma.newsletterSubscriber.upsert({
    where: {
      email,
    },
    update: {
      active: true,
    },
    create: {
      email,
      active: true,
    },
  });

  redirect("/pt?newsletter=sucesso#newsletter");
}