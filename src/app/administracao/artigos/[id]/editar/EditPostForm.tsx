"use client";

import { BlockEditor } from "@/components/editor/BlockEditor";
import type { EditorBlock } from "@/lib/editor/blocks";
import { updatePostAction } from "./actions";
import { useMemo, useState } from "react";
import { validatePostBeforePublish } from "@/lib/editor/validate-post";
import { EditorialChecklist } from "@/components/editor/EditorialChecklist";

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
  desktopReviewed: boolean;
  tabletReviewed: boolean;
  mobileReviewed: boolean;
};

type EditPostFormProps = {
  post: Post;
  categories: Category[];
};

export function EditPostForm({ post, categories }: EditPostFormProps) {
  const initialBlocks = Array.isArray(post.contentBlocks)
    ? (post.contentBlocks as EditorBlock[])
    : [];

  const [coverImage, setCoverImage] = useState(post.coverImage ?? "");
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description);
  const [status, setStatus] = useState(post.status);
  const [seoTitle, setSeoTitle] = useState(post.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(post.seoDescription ?? "");
  const [focusKeyword, setFocusKeyword] = useState(post.focusKeyword ?? "");
  const [coverImageAlt, setCoverImageAlt] = useState(post.coverImageAlt ?? "");
  const [blocks, setBlocks] = useState<EditorBlock[]>(initialBlocks);

  const [desktopReviewed, setDesktopReviewed] = useState(post.desktopReviewed);
  const [tabletReviewed, setTabletReviewed] = useState(post.tabletReviewed);
  const [mobileReviewed, setMobileReviewed] = useState(post.mobileReviewed);
  const [categoryName, setCategoryName] = useState(
    categories.find((category) => category.id === post.categoryId)?.name ?? ""
  );
  const [readTime, setReadTime] = useState(post.readTime ?? "");

  const [useLegacyHtml, setUseLegacyHtml] = useState(initialBlocks.length === 0);

  const validation = useMemo(
    () =>
      validatePostBeforePublish({
        title,
        description,
        categoryName,
        coverImage,
        coverImageAlt,
        seoTitle,
        seoDescription,
        focusKeyword,
        blocks,
        desktopReviewed,
        tabletReviewed,
        mobileReviewed,
        hasOtherPublishedPosts: true,
      }),
    [
      title,
      description,
      categoryName,
      coverImage,
      coverImageAlt,
      seoTitle,
      seoDescription,
      focusKeyword,
      blocks,
      desktopReviewed,
      tabletReviewed,
      mobileReviewed,
    ]
  );

  const publicationBlocked =
    (status === "PUBLISHED" || status === "SCHEDULED") && !validation.canPublish;

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
    <form
      action={updatePostAction.bind(null, post.id)}
      className="grid gap-6 lg:grid-cols-[1fr_360px]"
    >
      <div className="grid gap-6">
        <input type="hidden" name="coverImage" value={coverImage} />
        <div className="grid gap-2">
        <label className="text-sm font-bold">Título</label>
        <input
          name="title"
          required
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-[#556B2F]"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-bold">Descrição SEO / Resumo</label>
        <textarea
          name="description"
          required
          rows={3}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="rounded-2xl border border-black/10 bg-white p-4 text-sm outline-none focus:border-[#556B2F]"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-bold">Meta title</label>
        <input
          name="seoTitle"
          value={seoTitle}
          onChange={(event) => setSeoTitle(event.target.value)}
          placeholder="Título otimizado para Google"
          className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-[#556B2F]"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-bold">Meta description</label>
        <textarea
          name="seoDescription"
          rows={3}
          value={seoDescription}
          onChange={(event) => setSeoDescription(event.target.value)}
          placeholder="Descrição otimizada para aparecer nos resultados de busca."
          className="rounded-2xl border border-black/10 bg-white p-4 text-sm outline-none focus:border-[#556B2F]"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-bold">Palavra-chave principal</label>
        <input
          name="focusKeyword"
          value={focusKeyword}
          onChange={(event) => setFocusKeyword(event.target.value)}
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
            onChange={(event) => {
              const selectedCategory = categories.find(
                (category) => category.id === event.target.value
              );

              setCategoryName(selectedCategory?.name ?? "");
            }}
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
            value={readTime}
            onChange={(event) => setReadTime(event.target.value)}
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
            value={coverImageAlt}
            onChange={(event) => setCoverImageAlt(event.target.value)}
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
              <label className="text-sm font-bold"></label>
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
              <BlockEditor
                initialBlocks={initialBlocks}
                onBlocksChange={setBlocks}
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

      <label className="flex items-center gap-3 rounded-2xl border border-black/10 p-4 text-sm font-bold">
        <input name="isArticleOfWeek" type="checkbox" defaultChecked={post.isArticleOfWeek} />
        Definir como Artigo da Semana
      </label>

      <div className="grid gap-3 rounded-2xl border border-black/10 p-4">
        <p className="text-sm font-bold">Revisão de preview</p>

        <label className="flex items-center gap-3 text-sm font-bold">
          <input
            name="desktopReviewed"
            type="checkbox"
            checked={desktopReviewed}
            onChange={(event) => setDesktopReviewed(event.target.checked)}
          />
          Preview Desktop revisado
        </label>

        <label className="flex items-center gap-3 text-sm font-bold">
          <input
            name="tabletReviewed"
            type="checkbox"
            checked={tabletReviewed}
            onChange={(event) => setTabletReviewed(event.target.checked)}
          />
          Preview Tablet revisado
        </label>

        <label className="flex items-center gap-3 text-sm font-bold">
          <input
            name="mobileReviewed"
            type="checkbox"
            checked={mobileReviewed}
            onChange={(event) => setMobileReviewed(event.target.checked)}
          />
          Preview Mobile revisado
        </label>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-bold">Status</label>
        <select
          name="status"
          value={status}
          onChange={(event) => setStatus(event.target.value as typeof post.status)}
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
        disabled={publicationBlocked}
        className="w-fit rounded-full bg-[#556B2F] px-7 py-3 text-sm font-bold !text-white transition hover:bg-[#465a28] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {publicationBlocked ? "Complete os itens obrigatórios" : "Salvar alterações"}
      </button>
      </div>

      <div className="lg:sticky lg:top-6 lg:self-start">
        <EditorialChecklist
          overallScore={validation.overallScore}
          canPublish={validation.canPublish}
          missingRequired={validation.missingRequired}
          groups={validation.groups}
        />
      </div>
    </form>
  );
}
