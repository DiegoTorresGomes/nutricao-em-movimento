# Identidade profissional e transparência editorial

Etapa local de 7 de novembro de 2026. Sem deploy, alteração de dependências ou escrita de dados no banco.

## Auditoria anterior às alterações

- `src/config/nutritionist.ts` já diferenciava nome completo e nome público, mas não possuía `alternateName`, URL canônica de autora ou identificador de entidade.
- Sobre usava essa configuração; Home e artigos usavam `getNutritionistSettings()`, com dados editáveis armazenados no banco. Isso permitia nomes, CRN, biografias e temas divergentes.
- Os Person schemas da Home, Sobre e dos artigos eram construídos separadamente, apontando para `/pt/sobre`. A Home acrescentava endereço/área atendida; Sobre acrescentava `worksFor`. Esses campos não foram transportados para a nova entidade.
- O fallback de configurações citava uma instituição de ensino não confirmada no pedido. A citação foi retirada; não foi criada outra instituição, especialidade clínica, clínica, endereço ou empregador.
- O nome completo estava repetido literalmente no layout e no Open Graph dos artigos. Não havia página própria de autora nem `authorUrl` centralizado.
- A relação técnica `Post.authorId` apontava os 31 registros para uma conta chamada “Administrador”. O usuário confirmou expressamente que os artigos são da Weverlyn e que ela revisa as informações de saúde antes da publicação. Nenhum registro de usuário ou artigo foi renomeado.

Plano aplicado: centralizar identidade; estabelecer perfil canônico e uma entidade Person reutilizável; alinhar autoria; criar política e navegação; verificar HTML, schemas, metadata e build. Não houve substituição global cega nem revisão do corpo dos artigos.

## Fonte oficial

`src/config/nutritionist.ts` contém nome completo, `alternateName`, `displayName`, `jobTitle`, `credential`, foto, formação, temas, atendimento, canais e `authorUrl`. Os aliases `role` e `crn` reutilizam os campos oficiais, mantendo compatibilidade com componentes existentes.

A conta técnica confirmada foi associada à autora por ID em `publishingAccountIds`. A consulta também reconhece contas com o nome completo ou profissional da autora. Ao usar outra base de dados, conferir os IDs de publicação; não atribuir todos os artigos de qualquer administrador automaticamente.

Os campos de identidade salvos no painel não substituem mais a configuração canônica na Home e nos artigos. A Home preserva foto e canais editáveis, mas nome, profissão, CRN, biografia e temas públicos vêm da configuração. Não houve migração ou exclusão das configurações existentes.

## Página da autora

Rota: `/pt/autora/weverlyn-alves`.

- Hero com foto real, nome profissional, profissão, CRN e atendimento presencial/online.
- Bio objetiva, quatro formações confirmadas e seis temas editoriais.
- Até 12 artigos publicados, em português, com data de publicação válida e não futura, filtrados pela autoria confirmada e ordenados por `publishedAt DESC` (desempate por ID).
- Revalidação horária da listagem. Sem carrossel, animações, vídeo ou scripts terceiros novos.
- Links para todos os artigos, contato e Política Editorial.
- Foto limitada a 140 × 160 px no mobile, 200 × 240 px a partir de 768 px e 240 × 280 px a partir de 1024 px. Layout em duas colunas a partir de 768 px; títulos e links permitem quebra de linha.

Metadata usa o título solicitado sem duplicar o sufixo global, descrição, canonical oficial com www e Open Graph `profile`. A imagem OG global foi preservada.

## Person e Article

O Person final completo, extraído do HTML servido, está em [person-schema.json](./person-schema.json). É reutilizado na Home, Sobre e no novo perfil, com:

- `@id`: `https://www.nutricaoemovimento.com/pt/autora/weverlyn-alves#person`;
- `name`: `Weverlyn da Cruz Alves Torres`;
- `alternateName`: `Weverlyn Alves`;
- `jobTitle`: `Nutricionista`;
- `url`: `https://www.nutricaoemovimento.com/pt/autora/weverlyn-alves`;
- foto real, Instagram profissional já existente, seis temas confirmados;
- CRN como `identifier` do tipo `PropertyValue`, `propertyID: CRN`, `value: 24101524`;
- ausência de endereço, clínica, empregador, afiliação e `medicalSpecialty`.

O `BlogPosting.author` final está em [article-author.json](./article-author.json). Contém nome completo, URL canônica e o mesmo `@id` Person. Metadata padrão e Open Graph dos artigos apontam para a autora. A autoria visível e o bloco “Sobre a autora” mostram nome profissional e CRN e oferecem link para o perfil. As datas dos artigos não foram alteradas.

## Política Editorial

Rota: `/pt/politica-editorial`, indexável, canonical com www e imagem OG existente.

As 12 seções abrangem propósito, autoria, qualidade, fontes, revisão, atualização, correções, IA, independência, conflitos, limites educativos e contato para correções. A seleção de fontes depende do tema; não se afirma que todos os artigos usam todos os tipos de fonte. PubMed é apresentado como ferramenta de localização, sem equiparar indexação a validação científica.

Texto utilizado sobre IA:

> Ferramentas de inteligência artificial podem auxiliar na organização, pesquisa inicial, estruturação e revisão textual dos conteúdos. A responsabilidade editorial final é humana, e as informações de saúde são revisadas por Weverlyn Alves antes da publicação. Respostas e referências sugeridas por IA exigem conferência: a ferramenta não substitui avaliação profissional nem validação científica.

A afirmação de revisão humana foi incluída após confirmação explícita do usuário. Não se promete revisão externa independente, periodicidade fixa ou histórico público automatizado. A política estabelece que erros relevantes devem ser verificados/corrigidos e que datas não devem ser alteradas para simular novidade. Não foram inventados patrocinadores existentes. O disclaimer é referenciado, sem reprodução integral.

## Links e sitemap

- Footer institucional: Política Editorial; header principal preservado.
- Sobre: link discreto para perfil e artigos, sem redesenho da página.
- Home: nome público da nutricionista vinculado ao perfil.
- Artigos: byline e bloco de autora vinculados ao perfil.
- Perfil e política: links de contexto, contato e disclaimer.
- Sitemap: ambas as novas rotas, com domínio oficial. HTTP 200 confirmado antes da entrega.

## Verificação

| Item | Resultado |
| --- | --- |
| `npm run lint -- src` | Passou, 0 erros e 2 avisos preexistentes |
| `tsc --noEmit` | Passou |
| Build com Node 22.23.4 | Passou; 37 páginas geradas |
| Perfil e política | HTTP 200 |
| Canonicals | Domínio oficial com www |
| Person | Igual na Home, Sobre e perfil |
| BlogPosting.author | Mesmo nome, URL e ID da entidade Person |
| Sitemap | Contém as duas novas rotas |
| Footer | Link da Política Editorial presente no HTML do footer |
| Imagem profissional via next/image | HTTP 200 |
| Estrutura das novas páginas | Um H1 em cada; 12 H2 na política; H2/H3 no perfil |
| Listagem da autora | 12 links de artigos reais no smoke test |
| `git diff --check` | Passou |

Os dois avisos de lint são o `<img>` da área de segurança administrativa e o import não utilizado `destroySession` em AdminLayout, já existentes. O script de verificação somente de leitura está em `scripts/check-editorial.mjs`; os resultados HTTP estão em [http-checks.json](./http-checks.json). Para repetir, iniciar o build local e executar `node scripts/check-editorial.mjs`.

**Limite da verificação visual:** o host de automação de browser estava indisponível. A tentativa de acesso ao Chrome foi então interrompida pela ferramenta por não conseguir determinar a URL atual no Windows com confiança suficiente para aplicar sua política. Nenhum controle alternativo foi utilizado para contornar o bloqueio. A validação visual/teclado nos viewports **320, 375, 768, 1023 e 1440 px permanece pendente**. As dimensões acima são as implementadas em CSS, não medições de screenshots. Os links novos têm foco explícito e o conteúdo essencial é textual; não se afirma auditoria completa de acessibilidade ou ausência comprovada de overflow em navegador.

O guia local `node_modules/next/dist/docs/` indicado no AGENTS.md não existe nessa instalação. Foram consultados os guias oficiais da versão 15 para [metadata](https://nextjs.org/docs/15/app/api-reference/functions/generate-metadata) e [JSON-LD](https://nextjs.org/docs/15/app/guides/json-ld); os scripts JSON-LD alterados com conteúdo de artigos escapam `<`.

## Arquivos

Alterados: `src/config/nutritionist.ts`, `src/lib/posts.ts`, `src/lib/site-settings.ts`, `src/app/layout.tsx`, `src/app/pt/page.tsx`, `src/app/pt/sobre/page.tsx`, `src/app/pt/artigos/[slug]/page.tsx`, `src/app/sitemap.ts`, `src/components/sections/NutritionistSection.tsx` e `src/components/layout/Footer.tsx`.

Criados: `src/app/pt/autora/weverlyn-alves/page.tsx`, `src/app/pt/politica-editorial/page.tsx`, `scripts/check-editorial.mjs`, este relatório e os três arquivos JSON de evidências em `docs/editorial/`.

## Pendências humanas e limites de escopo

- Fazer a conferência visual e por teclado nas cinco larguras solicitadas quando o navegador estiver disponível.
- Revisar e aprovar o texto da Política Editorial antes do deploy; autoria e revisão humana já foram confirmadas nesta conversa.
- Conferir o vínculo da conta técnica se o ambiente de publicação usar outra base de dados.
- Manter as práticas declaradas (verificação de fontes, revisão humana e correções) na operação editorial. A política não cria um workflow técnico de revisão ou um histórico automatizado.

Sem avanço em Newsletter/Resend, clusters, páginas-pilar, revisão massiva dos artigos, Core Web Vitals ou nova solicitação do AdSense. Sem novas bibliotecas, sem alteração da imagem OG global, sem migrações, commit, push ou deploy. A implementação oferece transparência e consistência editorial; não garante posição no Search ou aprovação do AdSense.
