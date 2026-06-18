"use client";

import { useActionState } from "react";
import { createPostAction } from "./actions";
import { useState } from "react";
import { BlockEditor } from "@/components/editor/BlockEditor";

type Category = {
  id: string;
  name: string;
};

type CreatePostFormProps = {
  categories: Category[];
};

export function CreatePostForm({ categories }: CreatePostFormProps) {
  const [state, formAction, isPending] = useActionState(createPostAction, {});

  const [coverImage, setCoverImage] = useState("");
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [useLegacyHtml, setUseLegacyHtml] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [readTime, setReadTime] = useState("");

  async function handleCoverUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setIsUploadingCover(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "nutricao-em-movimento/articles");

    const response = await fetch("/api/upload/image", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.url) {
      setCoverImage(data.url);
    } else {
      alert(data.error || "Erro ao enviar imagem.");
    }

    setIsUploadingCover(false);
  }

  return (
    <form action={formAction} className="grid gap-6">
      <input type="hidden" name="coverImage" value={coverImage} />

      {state.error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
          {state.error}
        </div>
      )}

      <div className="rounded-[2rem] bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Informações principais</h2>

        <div className="mt-6 grid gap-6">
          <div className="grid gap-2">
            <label className="text-sm font-bold">Título</label>
            <input
              name="title"
              required
              placeholder="Ex: Como diferenciar fome física de fome emocional"
              className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-[#556B2F]"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-bold">Descrição SEO / Resumo</label>
            <textarea
              name="description"
              required
              rows={3}
              placeholder="Resumo curto que aparecerá nos cards e no Google."
              className="rounded-2xl border border-black/10 bg-white p-4 text-sm outline-none focus:border-[#556B2F]"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <label className="text-sm font-bold">Categoria</label>
              <select
                name="categoryId"
                required
                className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-[#556B2F]"
                onChange={(event) => {
                  const selectedCategory = categories.find(
                    (category) => category.id === event.target.value
                  );

                  setCategoryName(selectedCategory?.name ?? "");
                }}
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-bold">Tempo de leitura</label>
              <input
                name="readTime"
                placeholder="Ex: 5 min de leitura"
                className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-[#556B2F]"
                value={readTime}
                onChange={(event) => setReadTime(event.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">SEO do artigo</h2>

        <div className="mt-6 grid gap-6">
          <div className="grid gap-2">
            <label className="text-sm font-bold">Meta title</label>
            <input
              name="seoTitle"
              placeholder="Título otimizado para Google"
              className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-[#556B2F]"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-bold">Meta description</label>
            <textarea
              name="seoDescription"
              rows={3}
              placeholder="Descrição otimizada para aparecer nos resultados de busca."
              className="rounded-2xl border border-black/10 bg-white p-4 text-sm outline-none focus:border-[#556B2F]"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-bold">Palavra-chave principal</label>
            <input
              name="focusKeyword"
              placeholder="Ex: fome emocional"
              className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-[#556B2F]"
            />
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Imagem de capa</h2>

        <div className="mt-6 grid gap-4 md:grid-cols-[260px_1fr]">
          <div>
            <div className="aspect-[16/10] overflow-hidden rounded-[2rem] bg-[#E9DCC9]">
              {coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coverImage} alt="Capa do artigo" className="h-full w-full object-cover" />
              ) : null}
            </div>

            <label className="mt-4 inline-flex cursor-pointer rounded-full bg-[#111111] px-5 py-3 text-sm font-bold !text-white transition hover:bg-[#556B2F]">
              {isUploadingCover ? "Enviando..." : "Enviar capa"}
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                className="hidden"
                disabled={isUploadingCover}
              />
            </label>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-bold">Texto alternativo da imagem</label>
            <input
              name="coverImageAlt"
              placeholder="Descrição curta da imagem para acessibilidade e SEO"
              className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-[#556B2F]"
            />
            <p className="text-xs text-neutral-500">
              Ex: Nutricionista preparando refeição equilibrada.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold">Conteúdo do artigo</h2>
            <p className="mt-1 text-sm text-neutral-500">
              Use o editor visual para montar o artigo sem HTML.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setUseLegacyHtml((current) => !current)}
            className="w-fit rounded-full border border-black/10 px-5 py-2.5 text-sm font-bold transition hover:border-[#556B2F] hover:text-[#556B2F]"
          >
            {useLegacyHtml ? "Usar editor visual" : "Usar HTML manual"}
          </button>
        </div>

        <div className="mt-6">
          {useLegacyHtml ? (
            <div className="grid gap-2">
              <label className="text-sm font-bold">HTML manual</label>
              <textarea
                name="content"
                required
                rows={16}
                placeholder={`Use HTML simples por enquanto. Ex:
<p>Introdução do artigo...</p>

<h2>Primeiro tópico</h2>

<p>Texto do conteúdo...</p>

<blockquote>Frase de destaque</blockquote>`}
                className="rounded-2xl border border-black/10 bg-white p-4 font-mono text-sm leading-7 outline-none focus:border-[#556B2F]"
              />
            </div>
          ) : (
            <>
              <BlockEditor
                previewData={{
                  title,
                  description,
                  categoryName,
                  coverImage,
                  readTime: readTime || "5 min de leitura",
                }}
              />

              <textarea name="content" defaultValue="" className="hidden" aria-hidden="true" />
            </>
          )}
        </div>
      </div>

      <div className="rounded-[2rem] bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Publicação</h2>

        <div className="mt-6 grid gap-6">
          <label className="flex items-center gap-3 rounded-2xl border border-black/10 p-4 text-sm font-bold">
            <input name="isArticleOfWeek" type="checkbox" />
            Definir como Artigo da Semana
          </label>

          <div className="grid gap-3 rounded-2xl border border-black/10 p-4">
            <p className="text-sm font-bold">Revisão de preview</p>

            <label className="flex items-center gap-3 text-sm font-bold">
              <input name="desktopReviewed" type="checkbox" />
              Preview Desktop revisado
            </label>

            <label className="flex items-center gap-3 text-sm font-bold">
              <input name="tabletReviewed" type="checkbox" />
              Preview Tablet revisado
            </label>

            <label className="flex items-center gap-3 text-sm font-bold">
              <input name="mobileReviewed" type="checkbox" />
              Preview Mobile revisado
            </label>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-bold">Status</label>
            <select
              name="status"
              defaultValue="DRAFT"
              className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-[#556B2F]"
            >
              <option value="DRAFT">Salvar como rascunho</option>
              <option value="REVIEW">Enviar para revisão</option>
              <option value="SCHEDULED">Agendar publicação</option>
              <option value="PUBLISHED">Publicar agora</option>
            </select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-bold">Data e hora de agendamento</label>
            <input
              name="scheduledAt"
              type="datetime-local"
              className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-[#556B2F]"
            />
            <p className="text-xs text-neutral-500">
              Use este campo somente quando o status for “Agendar publicação”.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-[#556B2F] px-7 py-3 text-sm font-bold !text-white transition hover:bg-[#465a28] disabled:opacity-50"
        >
          {isPending ? "Salvando..." : "Salvar artigo"}
        </button>
      </div>
    </form>
  );
}
