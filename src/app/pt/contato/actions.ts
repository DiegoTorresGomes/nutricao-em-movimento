"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { isValidSubject } from "./contact-subjects";

// Limites de tamanho (validados no servidor — não confiar no cliente).
const NAME_MIN = 2;
const NAME_MAX = 80;
const EMAIL_MAX = 160;
const MESSAGE_MIN = 10;
const MESSAGE_MAX = 4000;
const PHONE_MAX = 40;

// Anti-spam invisível.
const MIN_FILL_MS = 2500; // envios mais rápidos que isso são tratados como bot.
const MAX_URLS = 5;

// Rate limit por IP: no máximo 5 envios a cada 10 minutos (padrão do projeto).
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ContactFieldErrors = Partial<
  Record<"name" | "email" | "subject" | "message", string>
>;

export type ContactFormState = {
  status: "idle" | "success" | "error";
  // Mensagem de nível de formulário (erro genérico / limite excedido).
  formError?: string;
  fieldErrors?: ContactFieldErrors;
};

async function getClientIp(): Promise<string | null> {
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? null;
  }
  return headersList.get("x-real-ip");
}

// Remove caracteres de controle, preservando tab (9), LF (10) e CR (13) para
// manter as quebras de linha da mensagem. Sem regex de caractere de controle.
function sanitize(value: string): string {
  let out = "";
  for (const ch of value) {
    const code = ch.charCodeAt(0);
    if (code < 32 && code !== 9 && code !== 10 && code !== 13) continue;
    if (code === 127) continue;
    out += ch;
  }
  return out;
}

function collapseSpaces(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function countUrls(value: string): number {
  return (value.match(/https?:\/\//gi) ?? []).length;
}

export async function sendContactMessageAction(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  // 1) Honeypot: campo oculto que humanos não preenchem. Se vier preenchido,
  // resposta neutra (finge sucesso), sem persistir.
  const honeypot = String(formData.get("company") || "").trim();
  if (honeypot) {
    return { status: "success" };
  }

  // 2) Tempo de preenchimento: envios instantâneos indicam bot → neutro.
  const renderedAt = Number(formData.get("renderedAt") || 0);
  if (renderedAt && Date.now() - renderedAt < MIN_FILL_MS) {
    return { status: "success" };
  }

  const name = collapseSpaces(sanitize(String(formData.get("name") || "")));
  const email = sanitize(String(formData.get("email") || ""))
    .trim()
    .toLowerCase();
  const subject = String(formData.get("subject") || "").trim();
  const message = sanitize(String(formData.get("message") || "")).trim();
  const phone = collapseSpaces(sanitize(String(formData.get("phone") || "")));

  // 3) Validação server-side por campo.
  const fieldErrors: ContactFieldErrors = {};

  if (name.length < NAME_MIN) {
    fieldErrors.name = "Informe seu nome.";
  } else if (name.length > NAME_MAX) {
    fieldErrors.name = "Nome muito longo.";
  }

  if (!email || !EMAIL_REGEX.test(email) || email.length > EMAIL_MAX) {
    fieldErrors.email = "Informe um e-mail válido.";
  }

  // Assunto: allowlist no servidor (não confia no valor do cliente).
  if (!isValidSubject(subject)) {
    fieldErrors.subject = "Selecione um assunto válido.";
  }

  if (message.length < MESSAGE_MIN) {
    fieldErrors.message = "Escreva uma mensagem com pelo menos 10 caracteres.";
  } else if (message.length > MESSAGE_MAX) {
    fieldErrors.message = "Mensagem muito longa.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", fieldErrors };
  }

  // 4) Excesso de URLs na mensagem → tratado como spam (resposta neutra).
  if (countUrls(message) >= MAX_URLS) {
    return { status: "success" };
  }

  // 5) Rate limit por IP. Ao exceder, mostra mensagem amigável (usuário real).
  const ip = await getClientIp();
  const { allowed } = rateLimit(`contact:${ip ?? "unknown"}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!allowed) {
    return {
      status: "error",
      formError:
        "Você enviou muitas mensagens em pouco tempo. Aguarde alguns minutos e tente novamente.",
    };
  }

  // 6) Persistência estruturada: cada dado em sua coluna (name, email, phone,
  // subject, message) com status inicial NEW. Nada é concatenado no corpo.
  try {
    await prisma.contactMessage.create({
      data: {
        name: name.slice(0, NAME_MAX),
        email: email.slice(0, EMAIL_MAX),
        phone: phone ? phone.slice(0, PHONE_MAX) : null,
        subject,
        message: message.slice(0, MESSAGE_MAX),
        status: "NEW",
      },
    });
  } catch {
    // Erro genérico — sem vazar provedor, stack, endpoint ou detalhes do banco.
    return {
      status: "error",
      formError:
        "Não foi possível enviar sua mensagem agora. Tente novamente em alguns instantes ou utilize um dos canais oficiais.",
    };
  }

  return { status: "success" };
}
