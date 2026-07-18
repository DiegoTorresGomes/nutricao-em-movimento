import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleViewCounter } from "@/components/ArticleViewCounter";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { Button } from "@/components/ui/Button";
import { getNutritionistSettings } from "@/lib/site-settings";
import { getPublishedPostBySlug, getRelatedPosts } from "@/lib/posts";

type ArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedPostBySlug(slug);

  if (!article) {
    return {
      title: "Artigo não encontrado",
    };
  }

  const articleUrl = `/pt/artigos/${article.slug}`;
  const imageUrl = article.coverImage || "/images/og/nutricao-em-movimento.jpg";

  return {
    title: article.title,
    description: article.description,

    alternates: {
      canonical: articleUrl,
    },

    openGraph: {
      type: "article",
      locale: "pt_BR",
      url: articleUrl,
      siteName: "Nutrição & Movimento",
      title: article.title,
      description: article.description,
      publishedTime: article.publishedAt?.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      authors: ["Weverlyn da Cruz Alves Torres"],
      section: article.category.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.coverImageAlt || article.title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [imageUrl],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getPublishedPostBySlug(slug);

  const nutritionistSettings = await getNutritionistSettings();

  if (!article) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(article.categoryId, article.id, 3);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    inLanguage: "pt-BR",
    headline: article.title,
    description: article.description,
    image: article.coverImage
      ? [article.coverImage]
      : ["https://nutricaoemovimento.com/images/og/nutricao-em-movimento.jpg"],
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: nutritionistSettings.name,
      jobTitle: nutritionistSettings.role,
      url: "https://nutricaoemovimento.com/pt/sobre",
      image: nutritionistSettings.photoUrl
        ? `https://nutricaoemovimento.com${nutritionistSettings.photoUrl}`
        : undefined,
      sameAs: [nutritionistSettings.instagramUrl],
    },
    publisher: {
      "@type": "Organization",
      name: "Nutrição & Movimento",
      logo: {
        "@type": "ImageObject",
        url: "https://nutricaoemovimento.com/images/og/nutricao-em-movimento.jpg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://nutricaoemovimento.com/pt/artigos/${article.slug}`,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Início",
        item: "https://nutricaoemovimento.com/pt",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Artigos",
        item: "https://nutricaoemovimento.com/pt/artigos",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: `https://nutricaoemovimento.com/pt/artigos/${article.slug}`,
      },
    ],
  };

  return (
    <PublicLayout>
      <main className="overflow-x-hidden">
        <ArticleViewCounter postId={article.id} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbJsonLd),
          }}
        />
        <article>
          <header className="bg-[#FAF8F4] px-4 py-16 sm:px-6 md:py-24">
            <div className="mx-auto max-w-4xl">
              <nav aria-label="Breadcrumb" className="mb-6 text-xs text-neutral-500">
                <ol className="flex flex-wrap items-center gap-2">
                  <li>
                    <Link href="/pt" className="transition hover:text-[#556B2F]">
                      Início
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li>
                    <Link href="/pt/artigos" className="transition hover:text-[#556B2F]">
                      Artigos
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li className="line-clamp-1 max-w-[16rem] text-neutral-700">{article.title}</li>
                </ol>
              </nav>

              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#D67A5A]">
                {article.category.name}
              </p>

              <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">
                {article.title}
              </h1>

              <p className="mt-6 text-lg leading-8 text-neutral-700">{article.description}</p>

              <div className="mt-7 flex flex-wrap gap-3 text-sm text-neutral-500">
                <span>
                  {article.publishedAt
                    ? new Intl.DateTimeFormat("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }).format(article.publishedAt)
                    : "Sem data"}
                </span>
                <span>•</span>
                <span>{article.readTime}</span>
              </div>
            </div>
          </header>

          <section className="px-4 py-10 sm:px-6 md:py-14">
            <div className="mx-auto max-w-5xl">
              <div className="overflow-hidden rounded-[2rem] bg-[#FAF8F4]">
                {article.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={article.coverImage}
                    alt={article.coverImageAlt ?? article.title}
                    className="h-auto w-full object-contain"
                  />
                ) : null}
              </div>
            </div>
          </section>

          <section className="px-4 py-8 sm:px-6 md:py-14">
            <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="min-w-0 max-w-3xl">
                <div
                  className="article-content space-y-6 text-base leading-8 text-neutral-800 sm:text-lg sm:leading-9"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              </div>

              <aside className="h-fit rounded-[2rem] bg-[#111111] p-6 text-white lg:sticky lg:top-28">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#E9DCC9]">
                  Autora
                </p>

                <div className="mt-5 flex items-center gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-full bg-[#E9DCC9]">
                    {nutritionistSettings.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={nutritionistSettings.photoUrl}
                        alt={nutritionistSettings.name}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold leading-tight">
                      {nutritionistSettings.name}
                    </h3>

                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-white/45">
                      {nutritionistSettings.crn}
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-7 text-white/70">{nutritionistSettings.bio}</p>

                <div className="mt-6">
                  <Button href={nutritionistSettings.instagramUrl} external variant="light">
                    Instagram
                  </Button>
                </div>
              </aside>
            </div>
          </section>

          <section className="px-4 pb-16 sm:px-6 md:pb-20">
            <div className="mx-auto max-w-4xl rounded-[2rem] border border-black/5 bg-[#FAF8F4] p-6 text-sm leading-7 text-neutral-700">
              <strong className="text-[#111111]">Aviso importante:</strong> as informações deste
              artigo têm caráter educativo e não substituem avaliação individualizada com
              nutricionista.
            </div>
          </section>
        </article>

        {relatedPosts.length > 0 && (
          <section className="px-4 pb-16 sm:px-6 md:pb-20">
            <div className="mx-auto max-w-6xl">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#D67A5A]">
                Continue lendo
              </p>

              <h2 className="mt-4 text-2xl font-semibold leading-tight sm:text-3xl">
                Artigos relacionados
              </h2>

              <div className="mt-8 flex flex-wrap justify-center gap-6 sm:justify-start">
                {relatedPosts.map((related) => (
                  <ArticleCard
                    key={related.slug}
                    category={related.category.name}
                    title={related.title}
                    description={related.description}
                    slug={related.slug}
                    coverImage={related.coverImage}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        <NewsletterSection />
      </main>
    </PublicLayout>
  );
}
