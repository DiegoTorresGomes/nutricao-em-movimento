import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { nutritionistConfig as author, nutritionistPersonSchema } from "@/config/nutritionist";
import { getPublishedAuthorPosts } from "@/lib/posts";

export const revalidate = 3600;

const title = "Weverlyn Alves | Nutricionista e autora do Nutrição & Movimento";
const description = "Conheça Weverlyn Alves, nutricionista, CRN 24101524 e autora do Nutrição & Movimento. Formação, temas de atuação e artigos publicados.";
export const metadata: Metadata = {
  title: { absolute: title }, description,
  alternates: { canonical: author.authorUrl },
  openGraph: { title, description, type: "profile", url: author.authorUrl,
    images: [{ url: "/images/og/nutricao-em-movimento.jpg", width: 1200, height: 630, alt: "Nutrição & Movimento" }] },
};

const linkStyle = "inline-flex rounded-lg font-bold text-[#465a28] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#556B2F]";

export default async function AuthorPage() {
  const posts = await getPublishedAuthorPosts();
  return (
    <PublicLayout>
      <main className="author-profile mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(nutritionistPersonSchema).replace(/</g, "\\u003c") }} />
        <section aria-labelledby="author-title" className="grid min-w-0 gap-7 rounded-3xl bg-[#FAF8F4] p-5 sm:p-8 md:grid-cols-[200px_minmax(0,1fr)] md:items-center lg:grid-cols-[240px_minmax(0,1fr)]">
          <Image src={author.photoUrl} alt={author.photoAlt} width={240} height={280} sizes="(min-width: 1024px) 240px, (min-width: 768px) 200px, 140px" priority className="mx-auto h-[160px] w-[140px] max-w-full rounded-2xl object-cover md:h-[240px] md:w-[200px] lg:h-[280px] lg:w-[240px]" />
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#556B2F]">Autora do Nutrição &amp; Movimento</p>
            <h1 id="author-title" className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">{author.displayName}</h1>
            <p className="mt-3 font-bold text-neutral-700">{author.jobTitle} · {author.credential}</p>
            <p className="mt-2 text-sm text-neutral-700">{author.attendance.label}</p>
            <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-700">{author.bio}</p>
          </div>
        </section>
        <section aria-labelledby="formation-title" className="mt-12">
          <h2 id="formation-title" className="text-2xl font-semibold">Formação acadêmica</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">{author.formations.map(item => <li key={item} className="border-l-2 border-[#556B2F] bg-[#FAF8F4] p-4 text-neutral-700">{item}</li>)}</ul>
        </section>
        <section aria-labelledby="themes-title" className="mt-12">
          <h2 id="themes-title" className="text-2xl font-semibold">Temas principais</h2>
          <p className="mt-3 leading-7 text-neutral-700">Temas abordados nos conteúdos educativos do blog.</p>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{author.themes.map(theme => <li key={theme.title} className="rounded-2xl border border-black/10 p-5"><h3 className="text-lg font-semibold">{theme.title}</h3><p className="mt-2 text-sm leading-7 text-neutral-700">{theme.description}</p></li>)}</ul>
        </section>
        <section aria-labelledby="posts-title" className="mt-12">
          <h2 id="posts-title" className="text-2xl font-semibold">Artigos publicados</h2>
          <p className="mt-3 text-neutral-700">Até 12 publicações mais recentes da autora, em ordem de publicação.</p>
          {posts.length ? <ul className="mt-6 grid gap-4 md:grid-cols-2">{posts.map(post => <li key={post.id} className="min-w-0 rounded-2xl border border-black/10 p-5"><p className="text-xs font-bold text-[#556B2F]">{post.category.name}</p><h3 className="mt-2 text-xl font-semibold leading-snug"><Link className={linkStyle} href={`/pt/artigos/${post.slug}`}>{post.title}</Link></h3><p className="mt-3 text-sm leading-7 text-neutral-700">{post.description}</p>{post.publishedAt && <time className="mt-3 block text-sm text-neutral-600" dateTime={post.publishedAt.toISOString()}>{post.publishedAt.toLocaleDateString("pt-BR", {timeZone: "America/Sao_Paulo"})}</time>}</li>)}</ul> : <p className="mt-5 text-neutral-700">Nenhum artigo publicado disponível neste momento.</p>}
        </section>
        <nav aria-label="Mais informações sobre a autora" className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-black/10 pt-6">
          <Link className={linkStyle} href="/pt/artigos">Ver todos os artigos</Link>
          <Link className={linkStyle} href="/pt/contato">Entrar em contato</Link>
          <Link className={linkStyle} href="/pt/politica-editorial">Conhecer a Política Editorial</Link>
        </nav>
      </main>
    </PublicLayout>
  );
}
