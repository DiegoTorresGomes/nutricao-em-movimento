"use client";

import Link from "next/link";
import { useActionState, useEffect, useId, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { nutritionistConfig } from "@/config/nutritionist";
import {
  CONTACT_CARDS,
  CONTACT_SUBJECTS,
  type ContactSubject,
} from "./contact-subjects";
import {
  sendContactMessageAction,
  type ContactFormState,
} from "./actions";

const initialState: ContactFormState = { status: "idle" };

const { contact, displayName, role, crn, attendance, instagramUrl, whatsappUrl } =
  nutritionistConfig;

const whatsappHref = `${whatsappUrl}?text=${encodeURIComponent(
  contact.whatsappMessage,
)}`;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#111111] px-7 py-3 text-sm font-bold !text-white transition hover:bg-[#556B2F] disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit"
    >
      {pending ? "Enviando…" : "Enviar mensagem"}
    </button>
  );
}

export function ContactExperience() {
  const [state, formAction] = useActionState(
    sendContactMessageAction,
    initialState,
  );

  const [subject, setSubject] = useState<ContactSubject | "">("");
  // Marca de tempo de renderização (anti-bot invisível no servidor).
  const [renderedAt] = useState(() => Date.now());

  const formRef = useRef<HTMLFormElement>(null);
  const subjectRef = useRef<HTMLSelectElement>(null);
  const formTopRef = useRef<HTMLDivElement>(null);

  const ids = {
    name: useId(),
    email: useId(),
    phone: useId(),
    subject: useId(),
    message: useId(),
    privacy: useId(),
    responseHelp: useId(),
  };

  const errors = state.status === "error" ? state.fieldErrors : undefined;

  // Após sucesso: limpa os campos e o assunto, mantendo a confirmação visível.
  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      setSubject("");
    }
  }, [state.status]);

  function selectSubject(value: ContactSubject) {
    setSubject(value);
    formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    // Move o foco ao select para continuidade por teclado.
    window.setTimeout(() => subjectRef.current?.focus(), 350);
  }

  return (
    <>
      {/* 2.2 — Como posso ajudar? */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-16">
        <div className="max-w-3xl">
          <SectionLabel>Formas de contato</SectionLabel>
          <h2 className="mt-5 text-3xl font-semibold sm:text-4xl">
            Como posso ajudar?
          </h2>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CONTACT_CARDS.map((card) => {
            const active = subject === card.subject;
            return (
              <button
                key={card.subject}
                type="button"
                onClick={() => selectSubject(card.subject)}
                aria-pressed={active}
                className={`flex h-full flex-col rounded-[1.75rem] border p-6 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#556B2F] focus-visible:ring-offset-2 ${
                  active
                    ? "border-[#556B2F] bg-[#556B2F]/5"
                    : "border-black/10 bg-[#FAF8F4] hover:border-[#556B2F]/50"
                }`}
              >
                <span className="flex items-center gap-2 text-lg font-semibold text-[#111111]">
                  {card.title}
                  {active ? (
                    <span className="text-xs font-bold uppercase tracking-wide text-[#556B2F]">
                      Selecionado
                    </span>
                  ) : null}
                </span>
                <span className="mt-3 text-sm leading-7 text-neutral-700">
                  {card.description}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 10 — Bloco principal em duas colunas */}
      <section className="border-t border-black/5 bg-white px-4 py-14 sm:px-6 md:py-16">
        <div
          ref={formTopRef}
          className="mx-auto grid max-w-7xl scroll-mt-24 gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14"
        >
          {/* Canais oficiais + identidade profissional */}
          <div>
            <h2 className="text-2xl font-semibold text-[#111111]">
              Canais oficiais
            </h2>

            <div className="mt-6 grid gap-3">
              <a
                href={`mailto:${contact.email}?subject=Contato%20pelo%20site`}
                className="rounded-2xl border border-black/5 bg-[#FAF8F4] p-4 transition hover:border-[#556B2F]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#556B2F]"
              >
                <span className="block text-xs font-bold uppercase tracking-[0.2em] text-[#556B2F]">
                  E-mail
                </span>
                <span className="mt-1 block break-words text-sm font-semibold text-[#111111]">
                  {contact.email}
                </span>
              </a>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                aria-label="Conversar com a nutricionista pelo WhatsApp (abre em nova aba)"
                className="rounded-2xl border border-black/5 bg-[#FAF8F4] p-4 transition hover:border-[#556B2F]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#556B2F]"
              >
                <span className="block text-xs font-bold uppercase tracking-[0.2em] text-[#556B2F]">
                  WhatsApp
                </span>
                <span className="mt-1 flex items-center gap-1 text-sm font-semibold text-[#111111]">
                  Conversar com a nutricionista
                  <span aria-hidden="true">→</span>
                </span>
              </a>

              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-black/5 bg-[#FAF8F4] p-4 transition hover:border-[#556B2F]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#556B2F]"
              >
                <span className="block text-xs font-bold uppercase tracking-[0.2em] text-[#556B2F]">
                  Instagram
                </span>
                <span className="mt-1 block text-sm font-semibold text-[#111111]">
                  @nutri_lyn_weverlynalves
                </span>
              </a>
            </div>

            <p className="mt-4 text-sm text-neutral-600">
              Tempo médio de resposta: {contact.responseTime.toLowerCase()}.
            </p>

            {/* 11 — Identidade profissional (compacta, sem repetir a página Sobre) */}
            <div className="mt-8 rounded-[1.75rem] border border-black/5 bg-[#111111] p-6 text-white">
              <p className="text-lg font-semibold">{displayName}</p>
              <p className="mt-1 text-sm font-bold uppercase tracking-[0.2em] text-[#E9DCC9]">
                {role}
                {crn ? <span className="text-white/50"> · {crn}</span> : null}
              </p>
              <p className="mt-3 text-sm text-white/70">{attendance.label}</p>
              <Link
                href="/pt/sobre"
                className="mt-4 inline-flex text-sm font-bold text-[#E9DCC9] underline underline-offset-4 transition hover:text-white"
              >
                Conheça a nutricionista
              </Link>
            </div>
          </div>

          {/* Formulário */}
          <div>
            {state.status === "success" ? (
              <div
                role="status"
                aria-live="polite"
                className="rounded-[1.75rem] border border-[#556B2F]/20 bg-[#556B2F]/5 p-8"
              >
                <h2 className="text-2xl font-semibold text-[#111111]">
                  Mensagem enviada com sucesso.
                </h2>
                <p className="mt-3 text-base leading-8 text-neutral-700">
                  Obrigada pelo contato. Sua mensagem será respondida em{" "}
                  {contact.responseTime.toLowerCase()}.
                </p>
              </div>
            ) : (
              <form ref={formRef} action={formAction} noValidate className="grid gap-5">
                <h2 className="sr-only">Formulário de contato</h2>

                {/* Honeypot — oculto para humanos, visível para bots. */}
                <div aria-hidden="true" className="absolute left-[-9999px] top-[-9999px]">
                  <label htmlFor={`${ids.name}-company`}>Empresa</label>
                  <input
                    id={`${ids.name}-company`}
                    type="text"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <input type="hidden" name="renderedAt" value={renderedAt} />

                {state.status === "error" && state.formError ? (
                  <p
                    role="alert"
                    className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700"
                  >
                    {state.formError}
                  </p>
                ) : null}

                <div className="grid gap-2">
                  <label htmlFor={ids.name} className="text-sm font-bold">
                    Nome
                  </label>
                  <input
                    id={ids.name}
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    maxLength={80}
                    aria-invalid={errors?.name ? true : undefined}
                    aria-describedby={errors?.name ? `${ids.name}-error` : undefined}
                    className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-[#556B2F]"
                  />
                  {errors?.name ? (
                    <p id={`${ids.name}-error`} role="alert" className="text-sm text-red-700">
                      {errors.name}
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-2">
                  <label htmlFor={ids.email} className="text-sm font-bold">
                    E-mail
                  </label>
                  <input
                    id={ids.email}
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    inputMode="email"
                    maxLength={160}
                    aria-invalid={errors?.email ? true : undefined}
                    aria-describedby={errors?.email ? `${ids.email}-error` : undefined}
                    className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-[#556B2F]"
                  />
                  {errors?.email ? (
                    <p id={`${ids.email}-error`} role="alert" className="text-sm text-red-700">
                      {errors.email}
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-2">
                  <label htmlFor={ids.phone} className="text-sm font-bold">
                    Telefone ou WhatsApp{" "}
                    <span className="font-normal text-neutral-500">(opcional)</span>
                  </label>
                  <input
                    id={ids.phone}
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    maxLength={40}
                    className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-[#556B2F]"
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor={ids.subject} className="text-sm font-bold">
                    Assunto
                  </label>
                  <select
                    ref={subjectRef}
                    id={ids.subject}
                    name="subject"
                    required
                    value={subject}
                    onChange={(event) =>
                      setSubject(event.target.value as ContactSubject | "")
                    }
                    aria-invalid={errors?.subject ? true : undefined}
                    aria-describedby={errors?.subject ? `${ids.subject}-error` : undefined}
                    className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-[#556B2F]"
                  >
                    <option value="" disabled>
                      Selecione um assunto
                    </option>
                    {CONTACT_SUBJECTS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors?.subject ? (
                    <p id={`${ids.subject}-error`} role="alert" className="text-sm text-red-700">
                      {errors.subject}
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-2">
                  <label htmlFor={ids.message} className="text-sm font-bold">
                    Mensagem
                  </label>
                  <textarea
                    id={ids.message}
                    name="message"
                    required
                    rows={5}
                    maxLength={4000}
                    aria-invalid={errors?.message ? true : undefined}
                    aria-describedby={errors?.message ? `${ids.message}-error` : undefined}
                    className="rounded-2xl border border-black/10 bg-white p-4 text-sm outline-none focus:border-[#556B2F]"
                  />
                  {errors?.message ? (
                    <p id={`${ids.message}-error`} role="alert" className="text-sm text-red-700">
                      {errors.message}
                    </p>
                  ) : null}
                </div>

                <p id={ids.privacy} className="text-xs leading-6 text-neutral-500">
                  Ao enviar, você concorda com o tratamento dos dados necessários
                  para responder à sua mensagem. Consulte a{" "}
                  <Link
                    href="/pt/politica-de-privacidade"
                    className="font-semibold text-[#556B2F] underline underline-offset-2"
                  >
                    Política de Privacidade
                  </Link>
                  .
                </p>

                <SubmitButton />
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
