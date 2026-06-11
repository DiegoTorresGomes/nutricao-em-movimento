"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function sendContactMessageAction(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const message = String(formData.get("message") || "").trim();

  if (!name || !email.includes("@") || message.length < 10) {
    redirect("/pt/contato?status=erro");
  }

  await prisma.contactMessage.create({
    data: {
      name,
      email,
      message,
    },
  });

  redirect("/pt/contato?status=sucesso");
}