import { updatePostAction } from "./actions";

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
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
};

type EditPostFormProps = {
  post: Post;
  categories: Category[];
};

export function EditPostForm({ post, categories }: EditPostFormProps) {
  return (
    <form action={updatePostAction.bind(null, post.id)} className="grid gap-6">
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

      <div className="grid gap-2">
        <label className="text-sm font-bold">Conteúdo do artigo</label>
        <textarea
          name="content"
          required
          rows={14}
          defaultValue={post.content}
          className="rounded-2xl border border-black/10 bg-white p-4 font-mono text-sm leading-7 outline-none focus:border-[#556B2F]"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-bold">Status</label>
        <select
          name="status"
          defaultValue={post.status}
          className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-[#556B2F]"
        >
          <option value="DRAFT">Rascunho</option>
          <option value="PUBLISHED">Publicado</option>
          <option value="ARCHIVED">Arquivado</option>
        </select>
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