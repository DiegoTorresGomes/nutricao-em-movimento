import type { Metadata } from "next";
import Link from "next/link";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { nutritionistConfig as author } from "@/config/nutritionist";
import { siteConfig } from "@/config/site";

const description = "Conheça os critérios editoriais, fontes, processo de revisão, correções e princípios de transparência do Nutrição & Movimento.";
export const metadata: Metadata = {
  title: "Política Editorial", description,
  alternates: { canonical: `${siteConfig.url}/pt/politica-editorial` },
  robots: { index: true, follow: true },
  openGraph: { title: "Política Editorial | Nutrição & Movimento", description, type: "website", url: `${siteConfig.url}/pt/politica-editorial`, images: [{ url: "/images/og/nutricao-em-movimento.jpg", width: 1200, height: 630, alt: "Nutrição & Movimento" }] },
};

const sections = [
  { title: "Propósito editorial", text: "O Nutrição & Movimento compartilha informação educativa sobre nutrição, comportamento alimentar, alimentação e movimento e qualidade de vida. O objetivo é tornar o conhecimento acessível, respeitando os limites das evidências e as necessidades individuais." },
  { title: "Quem escreve os conteúdos", text: `A autoria e a responsabilidade editorial são de ${author.name}, conhecida profissionalmente como ${author.displayName}, ${author.jobTitle.toLowerCase()}, ${author.credential}. Sua formação e seus artigos publicados podem ser consultados na página da autora.` },
  { title: "Critérios de qualidade", text: "Os conteúdos devem apresentar linguagem clara, contexto e orientações compatíveis com as evidências disponíveis. Evitamos promessas de resultados garantidos, simplificações que distorçam os achados e a apresentação de temas editoriais como especialidades clínicas não declaradas." },
  { title: "Fontes e evidências", text: "Priorizamos diretrizes oficiais, documentos do Ministério da Saúde e da Organização Mundial da Saúde (OMS), sociedades científicas, artigos revisados por pares, revisões sistemáticas, meta-análises, consensos e guidelines reconhecidos. O PubMed pode apoiar a localização de estudos, mas a presença nessa base não dispensa sua avaliação crítica. A escolha das fontes depende do tema, de sua relevância e da qualidade metodológica; nem todo artigo utiliza todos esses tipos de fonte. Incertezas e limitações devem ser contextualizadas." },
  { title: "Processo de revisão", text: "Weverlyn Alves revisa as informações de saúde antes da publicação e assume a responsabilidade editorial final. Essa revisão considera clareza, coerência e adequação das informações e das fontes ao tema. Isso não significa revisão externa independente nem substitui avaliação clínica individualizada." },
  { title: "Atualização de conteúdos", text: "Novas evidências, mudanças em diretrizes e problemas identificados podem motivar atualização. Não há promessa de revisão em intervalos fixos. Atualizações substanciais podem alterar a data de modificação; datas não devem ser alteradas apenas para simular conteúdo novo. Quando pertinente, uma nota no próprio artigo deve explicar a revisão editorial." },
  { title: "Correções", text: "Erros factuais relevantes devem ser corrigidos após sua identificação e verificação. O processo começa pelo recebimento do apontamento, avaliação pela responsável editorial e correção do conteúdo quando necessária. Mudanças que afetem a interpretação do texto devem ser contextualizadas no próprio artigo. O site não mantém um histórico público automatizado de todas as alterações." },
  { title: "Uso de inteligência artificial", text: "Ferramentas de inteligência artificial podem auxiliar na organização, pesquisa inicial, estruturação e revisão textual dos conteúdos. A responsabilidade editorial final é humana, e as informações de saúde são revisadas por Weverlyn Alves antes da publicação. Respostas e referências sugeridas por IA exigem conferência: a ferramenta não substitui avaliação profissional nem validação científica." },
  { title: "Independência editorial", text: "O conteúdo editorial não é escrito para favorecer anunciantes. A eventual veiculação de publicidade não deve determinar as conclusões dos textos. Conteúdos patrocinados, caso venham a existir, devem ser identificados de forma clara para o leitor." },
  { title: "Conflitos de interesse", text: "Relações comerciais ou outros interesses que possam influenciar um conteúdo devem ser informados de modo claro junto à publicação. Uma recomendação editorial deve ser sustentada por critérios de relevância e qualidade, e não apenas por interesse comercial. Esta política não implica que o blog já tenha patrocinadores ou parcerias remuneradas." },
  { title: "Conteúdo educativo e limites", text: "As informações têm caráter informativo e educativo e não substituem consulta individualizada. Decisões de saúde devem considerar avaliação profissional adequada, condições clínicas e necessidades de cada pessoa. Os limites de uso do conteúdo estão detalhados no Disclaimer Nutricional." },
];
const linkStyle = "font-bold text-[#465a28] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#556B2F]";

export default function EditorialPolicyPage() {
  return <PublicLayout><main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#556B2F]">Transparência editorial</p>
    <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">Política Editorial</h1>
    <p className="mt-5 text-base leading-8 text-neutral-700">Como orientamos a produção, a revisão e a manutenção dos conteúdos do Nutrição &amp; Movimento.</p>
    <p className="mt-3 text-sm text-neutral-600">Atualizada em <time dateTime="2026-11-07">7 de novembro de 2026</time>.</p>
    <div className="mt-10 space-y-9">{sections.map((section, index) => <section key={section.title} aria-labelledby={`policy-${index}`}><h2 id={`policy-${index}`} className="text-2xl font-semibold">{index + 1}. {section.title}</h2><p className="mt-3 text-base leading-8 text-neutral-700">{section.text}</p>{index === 1 && <Link className={`mt-3 inline-block ${linkStyle}`} href={author.authorPath}>Conheça a formação e os artigos de {author.displayName}</Link>}{index === 10 && <Link className={`mt-3 inline-block ${linkStyle}`} href="/pt/disclaimer">Leia o Disclaimer Nutricional</Link>}</section>)}
      <section aria-labelledby="corrections-contact"><h2 id="corrections-contact" className="text-2xl font-semibold">12. Contato para correções</h2><p className="mt-3 text-base leading-8 text-neutral-700">Para apontar um possível erro, envie o endereço do artigo, o trecho em questão e, se possível, uma fonte que ajude a verificar a informação. O apontamento será avaliado pela responsável editorial.</p><p className="mt-3 break-words"><a className={linkStyle} href={`mailto:${author.contact.email}`}>{author.contact.email}</a></p><Link className={`mt-4 inline-block ${linkStyle}`} href="/pt/contato">Acesse os canais de contato do blog</Link></section>
    </div>
  </main></PublicLayout>;
}
