"use client";

import { BlockEditor } from "@/components/editor/BlockEditor";
import type { EditorBlock } from "@/lib/editor/blocks";
import { updatePostAction } from "./actions";
import { useState } from "react";

type Category = {
  id: string;
  name: string;
};

type Post = {
  id: string;
  title: string;
  description: string;
  content: string;
  readTime: string | null;
  categoryId: string;
  isArticleOfWeek: boolean;
  coverImage: string | null;
  coverImageAlt: string | null;
  status: "DRAFT" | "REVIEW" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
  contentBlocks: unknown;
  seoTitle: string | null;
  seoDescription: string | null;
  focusKeyword: string | null;
  scheduledAt: Date | null;
};

type EditPostFormProps = {
  post: Post;
  categories: Category[];
};

export function EditPostForm({ post, categories }: EditPostFormProps) {
  const [coverImage, setCoverImage] = useState(post.coverImage ?? "");
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const initialBlocks = Array.isArray(post.contentBlocks)
    ? (post.contentBlocks as EditorBlock[])
    : [];

  const [useLegacyHtml, setUseLegacyHtml] = useState(initialBlocks.length === 0);

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
    <form action={updatePostAction.bind(null, post.id)} className="grid gap-6">
      <input type="hidden" name="coverImage" value={coverImage} />
      <div className="grid gap-2">
        <label className="text-sm font-bold">Título</label>
        <input
          name="title"
          required
          defaultValue={post.title}
          className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-[#556B2F]"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-bold">Descrição SEO / Resumo</label>
        <textarea
          name="description"
          required
          rows={3}
          defaultValue={post.description}
          className="rounded-2xl border border-black/10 bg-white p-4 text-sm outline-none focus:border-[#556B2F]"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-bold">Meta title</label>
        <input
          name="seoTitle"
          defaultValue={post.seoTitle ?? ""}
          placeholder="Título otimizado para Google"
          className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-[#556B2F]"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-bold">Meta description</label>
        <textarea
          name="seoDescription"
          rows={3}
          defaultValue={post.seoDescription ?? ""}
          placeholder="Descrição otimizada para aparecer nos resultados de busca."
          className="rounded-2xl border border-black/10 bg-white p-4 text-sm outline-none focus:border-[#556B2F]"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-bold">Palavra-chave principal</label>
        <input
          name="focusKeyword"
          defaultValue={post.focusKeyword ?? ""}
          placeholder="Ex: fome emocional"
          className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-[#556B2F]"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <label className="text-sm font-bold">Categoria</label>
          <select
            name="categoryId"
            required
            defaultValue={post.categoryId}
            className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-[#556B2F]"
          >
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
            defaultValue={post.readTime ?? ""}
            className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-[#556B2F]"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[260px_1fr]">
        <div>
          <div className="aspect-[16/10] overflow-hidden rounded-[2rem] bg-[#E9DCC9]">
            {coverImage ? (
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
            defaultValue={post.coverImageAlt ?? ""}
            placeholder="Descrição curta da imagem para acessibilidade e SEO"
            className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-[#556B2F]"
          />
          <p className="text-xs text-neutral-500">
            Ex: Nutricionista preparando refeição equilibrada.
          </p>
        </div>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-bold">Conteúdo do artigo</label>
        <div className="grid gap-2">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <label className="text-sm font-bold">Conteúdo do artigo</label>
              <p className="mt-1 text-xs text-neutral-500">
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

          {useLegacyHtml ? (
            <textarea
              name="content"
              required
              rows={14}
              defaultValue={post.content}
              className="rounded-2xl border border-black/10 bg-white p-4 font-mono text-sm leading-7 outline-none focus:border-[#556B2F]"
            />
          ) : (
            <>
              <BlockEditor initialBlocks={initialBlocks} />

              <textarea name="content" defaultValue="" className="hidden" aria-hidden="true" />
            </>
          )}
        </div>
      </div>

      <label className="flex items-center gap-3 rounded-2xl border border-black/10 p-4 text-sm font-bold">
        <input name="isArticleOfWeek" type="checkbox" defaultChecked={post.isArticleOfWeek} />
        Definir como Artigo da Semana
      </label>

      <div className="grid gap-2">
        <label className="text-sm font-bold">Status</label>
        <select
          name="status"
          defaultValue={post.status}
          className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-[#556B2F]"
        >
          <option value="DRAFT">Rascunho</option>
          <option value="REVIEW">Em revisão</option>
          <option value="SCHEDULED">Agendado</option>
          <option value="PUBLISHED">Publicado</option>
          <option value="ARCHIVED">Arquivado</option>
        </select>
        <div className="grid gap-2">
          <label className="text-sm font-bold">Data e hora de agendamento</label>
          <input
            name="scheduledAt"
            type="datetime-local"
            defaultValue={
              post.scheduledAt ? new Date(post.scheduledAt).toISOString().slice(0, 16) : ""
            }
            className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-[#556B2F]"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-fit rounded-full bg-[#556B2F] px-7 py-3 text-sm font-bold !text-white transition hover:bg-[#465a28]"
      >
        Salvar alterações
      </button>
    </form>
  );
}
