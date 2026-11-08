# Auditoria de prontidão para reenvio ao AdSense

Data: 08/11/2026. Site: https://www.nutricaoemovimento.com. Escopo: auditoria, sem implementação.

## Decisão de hoje

**70/100 — AMARELO — QUASE PRONTO. Não reenviar hoje. Recomendação C: fazer Lote 2 + outras correções técnicas e de consentimento.**

O site tem utilidade editorial própria e uma base técnica substancialmente melhor que a descrita na rejeição anterior.
Há 30 artigos publicados: 3 fortes (A), 17 bons (B), 10 de revisão prioritária (C) e nenhum D publicado.
Persistem seis lacunas editoriais prioritárias em temas de saúde, além de divergências entre políticas e implementação de consentimento.
O ads.txt está ausente; a conexão administrativa do AdSense e a eventual CMP certificada não foram confirmadas.
O sitemap e o redirect da consolidação estão corretos nesta captura, sem a pendência anterior de cache.
Mobile, cookies em execução e Core Web Vitals permanecem sem validação suficiente.
Recomendo um lote adicional de seis artigos e a resolução dos critérios anteriores ao reenvio descritos em [bloqueadores.md](bloqueadores.md).
A nota é uma avaliação interna, não uma probabilidade de aprovação ou certificação do Google.

## Método, evidência e limites

Foram lidos o projeto local, a auditoria original dos 31 artigos, a reavaliação do Lote 1, o pacote aprovado da consolidação e o relatório de segurança anterior. Consultas SELECT conferiram os 31 registros atuais; requisições GET conferiram as 30 URLs publicadas, a URL arquivada, páginas institucionais, endpoints públicos e redirects. Os corpos atuais foram comparados integralmente aos textos já auditados/aprovados; o HTML público dos 30 publicados correspondeu ao banco, normalizados os links internos absolutos/relativos do template. Os registros selecionados permaneceram iguais entre o início e o fim, inclusive contadores. Não foram enviados formulários, executados scripts de visualização de artigos, escolhidos cookies ou acessadas áreas privadas.

Referências locais de base:

- [Auditoria editorial original](../../editorial/auditoria-artigos/avaliacoes.json) e [corpos auditados](../../editorial/auditoria-artigos/dados.json).
- [Reavaliação do Lote 1](../../editorial/revisao-lote-1/avaliacoes.json).
- [Pacote aprovado da consolidação](../../editorial/consolidacao-emagrecimento/pacote-aplicacao.json).
- [Relatório de segurança anterior](../../security/relatorio-2026-11-07.md).
- [Evidências atuais](evidencias.json), capturadas a partir de 2026-11-08T14:07:26.548Z; [audit de produção](seguranca-runtime.json), [audit completo](seguranca-completa.json) e [tentativa PageSpeed](pagespeed-mobile.json).

**Limites:** o host de acesso ao navegador estava indisponível. A alternativa de observação da janela existente foi interrompida pela ferramenta por não conseguir confirmar com segurança a URL atual; não houve interação com a página. Não se concluiu inspeção visual de desktop/mobile, tráfego de cookies, armazenamento real após escolhas ou anúncios injetados por JavaScript. A API PageSpeed devolveu HTTP 429 por quota. Não havia exportação identificada do Search Console no projeto. Não houve acesso ao painel AdSense, Privacy & Messaging ou certificação de CMP. Código local, HTML servido e comportamento em execução são evidências distintas neste relatório.

## 1. AdSense, publisher e ads.txt

O script nativo assíncrono está no head do layout global, em `src/app/layout.tsx`, com o identificador público **ca-pub-3638053236344020**. Não há componente dedicado que limite seu carregamento por tipo de página ou consentimento. A URL do script está efetivamente no HTML de produção, uma vez por página observada, inclusive nas institucionais, no login e no HTML de erro devolvido por `/ads.txt`. Não foi encontrada metadata específica alternativa de verificação do AdSense.

`/administracao` sem autenticação devolveu 307 para o login. O layout global indica risco de carregar o script também no ambiente administrativo renderizado, mas não foi inspecionada uma sessão autenticada. Não se afirma veiculação de anúncios dentro do painel.

Não foram identificados slots manuais `ins.adsbygoogle` no HTML coletado, configuração local de Auto Ads nem duplicação do loader. GTM não apareceu ativo nas capturas; uma configuração futura de GTM poderia duplicar uma integração global. **Auto Ads, aprovação da conta, associação deste domínio ao publisher e anúncios efetivamente veiculados permanecem não confirmados.** O loader público confirma presença do código, não o estado da conta.

**ads.txt: AUSENTE.** `https://www.nutricaoemovimento.com/ads.txt` devolveu **404, text/html**, com a página de erro Next, e não um arquivo de vendedores autorizados. Não há publisher, relacionamento DIRECT/RESELLER ou authority ID válidos para comparar nesse arquivo inexistente. Não foi encontrado `public/ads.txt` no projeto.

Se a conta confirmar uma relação direta para esse publisher, a linha esperada seria:

```text
google.com, pub-3638053236344020, DIRECT, f08c47fec0942fa0
```

Este exemplo é documentação: nenhum arquivo ads.txt foi criado. O Google descreve ads.txt como altamente recomendado, **não obrigatório universalmente**; sua ausência é uma pendência importante de preparação técnica, não prova isolada de motivo da rejeição. [Guia oficial](https://support.google.com/adsense/answer/12171612?hl=en).

## 2. Consentimento, CMP e políticas

### O que existe

O projeto contém banner próprio em `src/components/consent/CookieConsent.tsx`, armazenamento em `src/lib/consent.ts` e inicialização em `src/components/analytics/ConsentModeInit.tsx`. O código começa com necessários ativos, analytics e ads desativados. A escolha é persistida em localStorage `nem-consent-v1` e cookie `nem-consent`, por 180 dias, `Path=/`, `SameSite=Lax`, com `Secure` em HTTPS. O timestamp de atualização fica no armazenamento local. Isso descreve a implementação; não houve inspeção dos cookies em execução.

No HTML de produção existem **Google Analytics configurado e Consent Mode com defaults denied** para `ad_storage`, `ad_user_data`, `ad_personalization` e `analytics_storage`, com espera inicial de 500 ms. Não foram observados loaders ativos de GTM ou Clarity. Portanto, é incorreto descrever analytics como ausente ou afirmar que não existe inicialização de consentimento.

Os loaders do AdSense e do GA não aguardam necessariamente uma escolha afirmativa. O código envia atualizações de consentimento quando `gtag` existe; isso não equivale a bloquear toda comunicação externa. Consent Mode pode permitir pings sem cookies no modo avançado. Não é possível deduzir apenas do HTML que cookies publicitários foram gravados ou que o AdSense respeita todas as escolhas do banner. A documentação Google distingue claramente carregamento de tags e estado de consentimento. [Consent Mode](https://developers.google.com/tag-platform/security/concepts/consent-mode).

### Lacunas verificáveis e pontos sem prova

- A camada inicial oferece aceitar todos e personalizar; recusar todos está dentro da personalização. Recomenda-se escolha de rejeição igualmente acessível.
- Depois de salvar, o banner desaparece; não foi encontrado controle persistente para reabrir preferências no footer ou outro ponto da aplicação, embora a política prometa gerenciamento a qualquer momento.
- A política de cookies chama Analytics de uso futuro, em divergência com o loader público atual.
- O texto de continuidade de navegação como concordância não descreve adequadamente a escolha granular implementada.
- A política declara mecanismos Google compatíveis, mas não há prova observada de CMP certificada ativa/TCF. Não foram encontrados sinais explícitos de Funding Choices, `googlefc` ou TCF no código/HTML inicial. Isso **não exclui** configuração remota ou regional injetada posteriormente.
- A inicialização de defaults depende das variáveis de GA/GTM/Clarity, não do AdSense isolado. Os defaults existem hoje porque há analytics; retirar essas variáveis no futuro pode deixar o loader publicitário sem essa inicialização local.
- `docs/analytics-and-consent.md` precisa acompanhar a realidade: a promessa de ausência de terceiros sem variáveis não cobre o AdSense hardcoded; declarações de ausência de coleta antes da escolha também precisam distinguir loaders, pings e armazenamento.

**Estado CMP: banner próprio identificado; CMP Google/terceiro certificada e TCF não confirmados.** Consent Mode não é certificação de CMP. A exigência Google de CMP certificada com TCF aplica-se, em especial, à publicidade personalizada para usuários no EEE, Reino Unido e Suíça; não é uma regra universal de aprovação de todo site brasileiro. Definir geografia/formato de veiculação e comprovar a configuração aplicável antes de tratar esse item como concluído. Tráfego sem CMP certificada pode ter elegibilidade para anúncios limitados/não personalizados onde suportados. [Requisitos oficiais](https://support.google.com/adsense/answer/13554116?hl=en).

A recomendação é harmonizar textos e implementação, oferecer revisão/revogação acessível e validar escolhas em sessão limpa antes do reenvio. O relatório não certifica conformidade jurídica/LGPD. A ANPD recomenda transparência e controle efetivo sobre cookies; o Google exige divulgação pertinente sobre uso de dados e terceiros. [Guia ANPD](https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia-orientativo-cookies-e-protecao-de-dados-pessoais.pdf/@@display-file/file), [privacidade AdSense](https://support.google.com/adsense/answer/1348695?hl=en).

### Páginas institucionais

As oito páginas abaixo responderam 200, com canonical próprio e H1 único. Há conteúdo real, autoria/responsabilidade, limites educacionais e canais de contato, sem páginas meramente preenchidas com placeholders. A presença das páginas não resolve as contradições funcionais descritas acima.

| Página | Footer direto | Avaliação atual |
|---|---|---|
| `/pt/politica-de-privacidade` | Sim | Substantiva; conferir promessa sobre consentimento e entrega da newsletter |
| `/pt/politica-de-cookies` | Sim | Substantiva; corrigir Analytics futuro, continuidade e afirmações sobre Google |
| `/pt/termos-de-uso` | Sim | Propósito e limites claros; sem impedimento material observado |
| `/pt/disclaimer` | Sim | Curta por função, adequada como aviso; não remover por tamanho |
| `/pt/politica-editorial` | Sim | Processo e revisão identificáveis; aprovação humana confirmada pelo usuário |
| `/pt/sobre` | Sim | Apresentação, credencial, missão e acesso à autora |
| `/pt/contato` | Sim | Curta e funcional como canal; entrega/tempo de resposta não testados |
| `/pt/autora/weverlyn-alves` | Não | Acessível por Sobre, artigos e Política Editorial; não órfã |

## 3. Conteúdo atualizado e risco de baixo valor

As classes são da metodologia editorial do projeto, **não rótulos oficiais do Google**. Reutilizaram-se notas antigas apenas quando o corpo completo permaneceu igual. O Lote 1 e a consolidação usam as avaliações e pacotes novos, conferidos no conteúdo público atual. Média dos 30 publicados: 78,5/100.

| Classe | Quantidade | Leitura |
|---|---:|---|
| A | 3 | Fortes: #10, #14 e #19 |
| B | 17 | Bons; inclui #31, #3, #26, #6 e o consolidado #4 |
| C | 10 | Revisão prioritária; lista ordenada abaixo |
| D | 0 | Nenhum publicado |

Os cinco revisados têm notas #31:84, #3:85, #26:82, #6:85 e #10:88. O consolidado #4 tem 83/B. O antigo #20, anteriormente D, está arquivado e redireciona permanentemente para #4. Há 31 registros históricos, **30 conteúdos publicados distintos**, e não 31 publicados nem um D ativo.

### O que ainda pode parecer baixo valor

**Alto impacto:** em parte dos dez C, afirmações de saúde são sustentadas por nomes de instituições, assuntos genéricos ou estudos pouco ligados ao argumento; alguns textos repetem orientações de sono, culpa, prato e rotina sem satisfazer integralmente uma pergunta específica. Nos seis priorizados, isso afeta temas clínicos/comportamentais sensíveis ou um guia amplo de entrada. Autoria e disclaimer ajudam a confiança, mas não substituem a precisão do corpo.

**Médio impacto:** repetição entre FAQs/resumos; sobreposição leve de intenções em alimentação emocional, mindful eating e manutenção de peso; cards automáticos relacionados com aderência parcial; CTA de newsletter promete utilidade que a integração atual não entrega; busca sem ação implementada; divergências entre política e produto. A consolidação resolveu a duplicidade forte #20/#4, mas não demonstra que toda sobreposição temática futura deva virar redirect.

**Baixo impacto:** ajustes de naturalidade de palavras-chave, listas e títulos; link direto da autora no footer; refinamento de leitura e imagens. Quantidade de palavras, páginas legais curtas, sazonalidade de Setembro Amarelo e ausência de CTA comercial não são, isoladamente, razões para excluir páginas ou expandi-las artificialmente.

O Google avalia conteúdo próprio, utilidade e experiência de navegação. Não há, nas orientações consultadas, uma quota que justifique exigir mais artigos, um número fixo de palavras ou DOI em toda referência. A seleção abaixo é uma decisão editorial baseada nas lacunas atuais. [Prontidão de sites](https://support.google.com/adsense/answer/12176698?hl=en).

### Lote 2 e dez prioridades restantes

**Sim, fazer Lote 2 antes de reenviar: seis artigos.** Ordem por sensibilidade, lacuna de evidência, satisfação da intenção, redundância e nota; não apenas por menor nota.

| Ordem | Nº / nota | Artigo | Razão e critério de saída | Destino |
|---|---|---|---|---|
| 1 | #30 / 72 | Setembro Amarelo: alimentação e exercícios como parte do cuidado com a saúde mental | Tema muito sensível; fontes amplas e aplicação inespecífica. Vincular evidências às afirmações, preservar limites e encaminhamento ao cuidado, revisar com responsável clínica | Lote 2 |
| 2 | #22 / 71 | Comer à noite é falta de controle? | Referências descritivas de assuntos, sem estudos identificados. Separar fome acumulada, comportamento e condição clínica, sem autodiagnóstico | Lote 2 |
| 3 | #18 / 71 | Como criar um déficit calórico sem cortar calorias obsessivamente | Melhorar qualidade alimentar não garante déficit; falta acompanhamento concreto; referência normativa CFN requer conferência de vigência, sem declarar aqui que seja falsa | Lote 2 |
| 4 | #9 / 71 | Por que dietas muito restritivas costumam falhar? | Integrar mecanismos e literatura; separar restrição extrema, terapêutica e déficit moderado; evitar generalização de fracasso | Lote 2 |
| 5 | #2 / 71 | Comer por emoção é normal? | WHO, PubMed e periódico não identificam estudos; reduzir repetição e delimitar normalidade versus sofrimento, preservando limites diagnósticos | Lote 2 |
| 6 | #1 / 74 | Alimentação Consciente: O Que É, Benefícios e Como Praticar o Mindful Eating | Guia amplo sem bibliografia identificável para benefícios e revisões invocados; fonte rastreável e linguagem proporcional, inclusive alt da capa | Lote 2 |
| 7 | #27 / 74 | Como lidar com recaídas no processo de emagrecimento sem desistir | Dar especificidade à retomada e reduzir sobreposição com o guia consolidado; reavaliar após Lote 2 | Manutenção posterior |
| 8 | #17 / 74 | Alimentos bons ou ruins: por que essa classificação pode atrapalhar sua relação com a comida | Refinar evidência e aplicação sem criar nova dicotomia; diferenciar intenção dos demais comportamentais | Manutenção posterior |
| 9 | #23 / 73 | Como a alimentação influencia a disposição para treinar | Aprofundar resposta própria e evidência; distinguir dos conteúdos pré-treino já mais fortes | Manutenção posterior |
| 10 | #7 / 75 | Como parar de beliscar o dia todo sem entrar em dieta restritiva | Refinar diferenciação e orientações específicas; reduzir repetição em relação aos textos de fome e rotina | Manutenção posterior |

Os seis primeiros concentram problemas de rastreabilidade/precisão e resposta em temas sensíveis; os quatro seguintes ainda merecem revisão, mas não há evidência de que tornem todo o acervo imprestável ou exijam bloquear o reenvio até a revisão integral. **Estimativa: um lote adicional necessário na recomendação de hoje.** Um eventual lote posterior de quatro é manutenção condicionada à reavaliação, não um segundo lote obrigatório por quantidade. Reenvio depende da qualidade final e das outras correções, não de concluir mecanicamente seis arquivos. Weverlyn deve revisar e aprovar alterações de saúde antes da futura publicação; nada foi revisado/publicado nesta fase.

## 4. Autoria, revisão e YMYL

Weverlyn da Cruz Alves Torres e o nome profissional Weverlyn Alves são apresentados de forma compatível, com CRN 24101524. Os 30 artigos públicos têm vínculo ao perfil e credencial no template; BlogPosting aponta Person para `/pt/autora/weverlyn-alves`, com o mesmo identificador profissional. Sobre e perfil também apresentam Person; a Política Editorial identifica responsabilidade e revisão. O usuário confirmou que os artigos associados à conta técnica Administrador são de Weverlyn e que ela revisa antes de publicar. Isso é confirmação de processo pelo responsável, não consulta externa ao conselho nem auditoria independente dos registros clínicos de revisão.

O consolidado preserva `datePublished` de 22/06/2026 e usa `dateModified` editorial de 08/11/2026, sem simular publicação nova. Os textos revisados têm referências mais rastreáveis e linguagem proporcional. A presença de disclaimer e credencial não elimina as lacunas dos C; não se deve usar nomes genéricos de bases científicas como substitutos de documentos, nem expandir promessas de emagrecimento ou diagnóstico para tentar monetizar.

## 5. Indexabilidade, sitemap, robots e redirects

As 30 URLs publicadas responderam **200 com canonical próprio www/HTTPS**, e o conteúdo servido correspondeu ao conteúdo atual. As oito institucionais também estão acessíveis. Não há confirmação da quantidade realmente indexada pelo Google, impressões, ações manuais ou cobertura, porque não houve exportação/acesso utilizável do Search Console.

Sitemap: **200, 40 URLs = 30 artigos + 10 páginas estáticas**, incluindo autora e Política Editorial. A URL arquivada #20 está ausente; a #4 está presente com `lastmod=2026-11-08T13:45:29.480Z`, compatível com sua atualização editorial. Autora e Política Editorial não trazem lastmod, o que não invalida sitemap. Parte das páginas estáticas usa data de geração; futuramente preferir data de mudança significativa a recarimbar sem mudança.

O redirect #20 → #4 retorna **301** direto ao destino canônico. A captura sem www `/pt` retorna **308** para www; HTTP com www retorna **301** para HTTPS. A URL antiga também não apareceu na listagem, perfil ou feed atuais. O feed está 200 e já usa o novo resumo de B. **A pendência de cache registrada na etapa anterior não foi reproduzida; não se recomenda revalidar/salvar conteúdo nesta auditoria.** Não há evidência atual para manter aquele bloqueio.

Robots: **200**, permite `/`, bloqueia `/administracao`, `/administracao/`, `/login` e `/api/`, declara host www e o sitemap correto. Nenhum bloqueio indevido do conteúdo público foi observado. Não há bloqueio específico ao robô publicitário. Disallow não é autenticação nem garantia de desindexação.

Login: 200, fora do sitemap, porém herda `index, follow` e canonical da home `/pt`; não existe noindex específico no código inspecionado. Recomenda-se noindex apropriado e revisão dessa metadata, sem tomar canonical ou robots como substitutos. Admin sem sessão redireciona para login, sem conteúdo privado exposto pela amostra. Não foi realizada varredura de APIs ou teste de autenticação. Escopo global de anúncios nessas páginas merece correção antes de veiculação. Script presente, sozinho, não demonstra anúncio servido em inventário sem conteúdo editorial. [Política de inventário](https://support.google.com/publisherpolicies/answer/11112688?hl=en).

## 6. UX, navegação, páginas fracas e experiência sem anúncios

Home e listagem dão entrada aos artigos; corpo/template e cards relacionados permitem continuidade; Sobre, contato e políticas estão no footer, e autora é alcançável pelo Sobre e pelas assinaturas. Não foi identificada uma página institucional órfã nessa malha. O levantamento não é prova de que todo link externo ou todo item paginado esteja livre de problemas. Cards relacionados continuam automáticos, conforme exceção aceita na fase anterior, com afinidade às vezes parcial.

O botão de busca em `src/components/layout/Header.tsx` não tem ação/formulário/destino implementado. A newsletter tem CTAs de conteúdo/checklist e promessa de confirmação/entrega, mas `src/lib/newsletter/send-confirmation.ts` é um adaptador sem envio real, com integração pendente. Não houve inscrição de teste nem comprovação de envio em produção. A lacuna de implementação é suficiente para impedir marcar a jornada como funcional, mesmo sem afirmar que um e-mail de teste falhou. Privacidade menciona dupla confirmação e informações da inscrição; não se deve confundir essa menção a IP com prova de registro de consentimento do banner.

As páginas de contato, disclaimer e políticas têm propósito próprio: não são artigos e não precisam ser alongadas para uma suposta quota. Login e erro 404 são páginas operacionais, sem motivo para monetização editorial. As fragilidades editoriais relevantes são os dez C, sobretudo os seis priorizados, e não a mera extensão das páginas legais.

**Sem AdSense, o produto ainda é útil:** há 20 artigos fortes/bons, orientação prática, autoria responsável e organização de leitura. Ainda não parece inteiramente acabado por causa da busca e da newsletter sem implementação completa e das respostas menos específicas dos C. Esse juízo pesou na nota; remover anúncios não resolve essas lacunas de produto.

Não há slots manuais vazios identificados no HTML, nem evidência no código inspecionado de interstitial publicitário ou popup de captação. Não se pode afirmar ausência de anúncios ativos ou espaços excessivos em execução: Auto Ads e layout renderizado não foram observados. O banner próprio fixo pode ocupar parte importante da tela pequena; isso é hipótese para teste, não overflow observado.

## 7. Mobile e performance

Foram lidos HTML, viewport e implementação responsiva. Existem grids adaptativos, limites de largura, menu mobile e tratamento de conteúdo/imagens; isso indica preparação, não valida a interface renderizada.

| Superfície | Fonte/HTML | Validação visual de overflow, fontes, recortes, cards e botões |
|---|---|---|
| Home | Inspecionados | Pendente |
| Artigos/listagem | Inspecionados | Pendente |
| Artigo individual | Inspecionados | Pendente |
| Sobre | Inspecionados | Pendente |
| Autora | Inspecionados | Pendente |
| Política Editorial | Inspecionados | Pendente |
| Contato | Inspecionados | Pendente |

Cobrir depois larguras pequenas reais, menu aberto/fechado, leitura de artigo, newsletter, links legais e banner em todas as escolhas; não há constatação visual de botões cortados ou ausência deles nesta auditoria.

LCP, INP e CLS: **não medidos**. PageSpeed mobile para a home devolveu 429 por quota; não houve Lighthouse utilizável nem dados CrUX/GSC disponíveis. Os tempos de GET únicos em `evidencias.json` são tempos de resposta/transferência desta rede, não LCP, INP ou Core Web Vitals. **First Load JS atual não foi medido** e um build local não substituiria experiência real.

O projeto usa imagens Cloudinary com `next/image`, dimensões/aspectos definidos e configurações de domínio; há fontes locais e chunks Next no HTML. Verificar depois o peso das capas, tamanho efetivamente entregue, prioridades, fontes acima da dobra e efeito dos terceiros. Os cabeçalhos de cache variam por rota e estão preservados na evidência; a consistência atual do sitemap/listagens não é prova de cache/performance ótimos. O loader assíncrono do AdSense e GA introduzem trabalho de terceiros que precisa entrar no teste. Nenhuma imagem, fonte ou configuração de cache foi alterada.

## 8. Segurança atual

O relatório de 07/11 foi usado como histórico; o diagnóstico foi atualizado com `npm audit` e `npm audit --omit=dev`, sem instalar/atualizar dependências.

| Recorte | Críticas | Altas | Moderadas | Total de pacotes sinalizados |
|---|---:|---:|---:|---:|
| Dependências de produção | 0 | 1 | 1 | 2 |
| Árvore completa | 0 | 1 | 8 | 9 |

Next instalado: **15.5.29**. Prisma/client/adapter: **7.10.1**. O PostCSS interno do Next, **8.4.31**, concentra os avisos altos; o Next recebe sinalização moderada transitiva. Há múltiplos advisories no pacote PostCSS, não quatro explorações independentes demonstradas no site. Os moderados adicionais incluem cadeia de ferramentas ESLint/minimatch. As contagens são de pacotes, com relações transitivas; não devem ser somadas como número de incidentes. Prisma não recebeu sinalização no retorno atual.

O Node disponível localmente é 24.14.1; o relatório anterior validou 22.23.4. A versão do Node na hospedagem e a árvore efetiva do runtime remoto não foram confirmadas. O fato de a dependência entrar no recorte de produção não prova que um atacante consiga explorar uma rota pública: parte do risco depende do processamento de CSS não confiável. Não foi demonstrado exploit nem comprometimento. Há, porém, risco conhecido que precisa de avaliação de exposição/mitigação em fase própria; não descrever o projeto como sem vulnerabilidades. O retorno HTTP normal também não certifica segurança. [Advisory PostCSS](https://github.com/advisories/GHSA-6g55-p6wh-862q), [outro advisory PostCSS](https://github.com/advisories/GHSA-r28c-9q8g-f849).

## 9. Outras possibilidades de monetização

| Possibilidade | Base atual e limite de confiança |
|---|---|
| Newsletter | Formulários e fluxo preparados; entrega de confirmação ainda sem provedor real. Concluir serviço e consentimento antes de prometer materiais ou vender patrocínio |
| Atendimento | Perfil profissional e contato permitem encaminhamento; confirmar oferta, canal e regras profissionais antes de promover/agendar. Não foi criado funil nem testado atendimento |
| Produtos/serviços futuros | Arquitetura permite páginas próprias e conteúdo educativo; evitar promessas clínicas, diagnóstico ou resultado garantido |
| Afiliados | Sem integração de afiliados identificada no escopo; eventual uso deve ter identificação clara, critério editorial e separação de recomendação clínica |
| Conteúdo patrocinado | Possível com rotulagem explícita e revisão independente; Política Editorial deve acompanhar eventual operação real |

O potencial existe sem depender exclusivamente de ads, mas não justifica criar CTAs ou promessas de entregas inexistentes. Este é um mapa de adequação, não um plano comercial ou autorização de implementação.

## 10. Condições para nova decisão

Concluir e aprovar o Lote 2, harmonizar consentimento/políticas e comprovar a solução de consentimento aplicável à veiculação planejada são critérios anteriores ao reenvio desta recomendação. Além disso, resolver ou justificar com evidência os itens recomendados: ads.txt, escopo de anúncios/noindex, busca/newsletter, risco de dependências, mobile/performance e dados do Search Console/conta AdSense. Não há evidência de bloqueio geral de rastreamento, falha generalizada de páginas ou conteúdo privado exposto que justifique classificar todo o site como vermelho hoje.

Ver [scorecard.md](scorecard.md), [bloqueadores.md](bloqueadores.md) e [checklist.md](checklist.md). A avaliação deve ser repetida sobre o que for efetivamente publicado, sem pressupor que uma alteração local tenha chegado à produção. A decisão final de aprovação pertence ao Google.

## Registro de escopo

Foram criados somente arquivos de auditoria em `docs/monetizacao/adsense-pre-reenvio/`. Aplicação, artigos, banco, AdSense, CMP, cookies, políticas públicas, metadata, sitemap e redirects não foram alterados. Não houve commit, push ou deploy. Não iniciar automaticamente a fase de correções.

## Inventário publicado conferido

Numeração preservada da auditoria editorial original. Cada URL abaixo respondeu 200 com canonical próprio, vínculo à autora/CRN e corpo correspondente ao registro atual. Os 30 constam no sitemap; seus lastmod correspondem a uma das datas selecionadas do registro (publicação/atualização editorial/atualização). A equivalência de uma data não certifica, sozinha, uma mudança editorial significativa.

| Nº | Artigo público | Nota | Classe |
|---|---|---:|---|
| 1 | [Alimentação Consciente: O Que É, Benefícios e Como Praticar o Mindful Eating](https://www.nutricaoemovimento.com/pt/artigos/alimentacao-consciente-o-que-e-beneficios-e-como-praticar-o-mindful-eating) | 74 | C |
| 2 | [Comer por emoção é normal?](https://www.nutricaoemovimento.com/pt/artigos/comer-por-emocao-e-normal) | 71 | C |
| 3 | [Relação Saudável com a Comida: O Que É e Como Construí-la no Dia a Dia](https://www.nutricaoemovimento.com/pt/artigos/relacao-saudavel-com-a-comida-o-que-e-e-como-construi-la-no-dia-a-dia) | 85 | B |
| 4 | [Emagrecimento sustentável: como cuidar do corpo com equilíbrio, nutrição e movimento](https://www.nutricaoemovimento.com/pt/artigos/emagrecimento-sustentavel-como-cuidar-do-corpo-com-equilibrio-nutricao-e-movimento) | 83 | B |
| 5 | [Por que eu como mesmo sem fome? Entenda os gatilhos alimentares](https://www.nutricaoemovimento.com/pt/artigos/por-que-eu-como-mesmo-sem-fome-entenda-os-gatilhos-alimentares) | 76 | B |
| 6 | [Vontade de doce todo dia: o que pode estar acontecendo?](https://www.nutricaoemovimento.com/pt/artigos/vontade-de-doce-todo-dia-o-que-pode-estar-acontecendo) | 85 | B |
| 7 | [Como parar de beliscar o dia todo sem entrar em dieta restritiva](https://www.nutricaoemovimento.com/pt/artigos/como-parar-de-beliscar-o-dia-todo-sem-entrar-em-dieta-restritiva) | 75 | C |
| 8 | [Emagrecer sem passar fome: o que realmente ajuda no processo](https://www.nutricaoemovimento.com/pt/artigos/emagrecer-sem-passar-fome-o-que-realmente-ajuda-no-processo) | 76 | B |
| 9 | [Por que dietas muito restritivas costumam falhar?](https://www.nutricaoemovimento.com/pt/artigos/por-que-dietas-muito-restritivas-costumam-falhar) | 71 | C |
| 10 | [Carboidrato à noite engorda? Entenda sem terrorismo nutricional](https://www.nutricaoemovimento.com/pt/artigos/carboidrato-a-noite-engorda-entenda-sem-terrorismo-nutricional) | 88 | A |
| 11 | [Pão engorda? Como incluir sem culpa em uma alimentação equilibrada](https://www.nutricaoemovimento.com/pt/artigos/pao-engorda-como-incluir-sem-culpa-em-uma-alimentacao-equilibrada) | 80 | B |
| 12 | [Como montar um prato equilibrado sem complicar a alimentação](https://www.nutricaoemovimento.com/pt/artigos/como-montar-um-prato-equilibrado-sem-complicar-a-alimentacao) | 83 | B |
| 13 | [Ansiedade e alimentação: como uma coisa influencia a outra](https://www.nutricaoemovimento.com/pt/artigos/ansiedade-e-alimentacao-como-uma-coisa-influencia-a-outra) | 82 | B |
| 14 | [O que comer antes do treino? Guia simples para iniciantes](https://www.nutricaoemovimento.com/pt/artigos/o-que-comer-antes-do-treino-guia-simples-para-iniciantes) | 86 | A |
| 15 | [O que comer depois do treino para recuperar melhor?](https://www.nutricaoemovimento.com/pt/artigos/o-que-comer-depois-do-treino-para-recuperar-melhor) | 83 | B |
| 16 | [Alimentação saudável fora de casa: escolhas possíveis sem culpa](https://www.nutricaoemovimento.com/pt/artigos/alimentacao-saudavel-fora-de-casa-escolhas-possiveis-sem-culpa) | 81 | B |
| 17 | [Alimentos bons ou ruins: por que essa classificação pode atrapalhar sua relação com a comida](https://www.nutricaoemovimento.com/pt/artigos/alimentos-bons-ou-ruins-por-que-essa-classificacao-pode-atrapalhar-sua-relacao-com-a-comida) | 74 | C |
| 18 | [Como criar um déficit calórico sem cortar calorias obsessivamente](https://www.nutricaoemovimento.com/pt/artigos/como-criar-um-deficit-calorico-sem-cortar-calorias-obsessivamente) | 71 | C |
| 19 | [Como comer com mais atenção mesmo na rotina corrida](https://www.nutricaoemovimento.com/pt/artigos/como-comer-com-mais-atencao-mesmo-na-rotina-corrida) | 86 | A |
| 21 | [Exercícios ajudam no emagrecimento? Entenda além da queima calórica](https://www.nutricaoemovimento.com/pt/artigos/exercicios-ajudam-no-emagrecimento-entenda-alem-da-queima-calorica) | 75 | B |
| 22 | [Comer à noite é falta de controle? Entenda o que pode estar por trás](https://www.nutricaoemovimento.com/pt/artigos/comer-a-noite-e-falta-de-controle-entenda-o-que-pode-estar-por-tras) | 71 | C |
| 23 | [Como a alimentação influencia a disposição para treinar](https://www.nutricaoemovimento.com/pt/artigos/como-a-alimentacao-influencia-a-disposicao-para-treinar) | 73 | C |
| 24 | [Lanche da tarde: ideias práticas para manter a saciedade](https://www.nutricaoemovimento.com/pt/artigos/lanche-da-tarde-ideias-praticas-para-manter-a-saciedade) | 80 | B |
| 25 | [Café da manhã saudável: precisa mesmo comer ao acordar?](https://www.nutricaoemovimento.com/pt/artigos/cafe-da-manha-saudavel-precisa-mesmo-comer-ao-acordar) | 79 | B |
| 26 | [Nutrição e movimento: como cuidar do corpo com equilíbrio, consciência e constância](https://www.nutricaoemovimento.com/pt/artigos/nutricao-e-movimento-como-cuidar-do-corpo-com-equilibrio-consciencia-e-constancia) | 82 | B |
| 27 | [Como lidar com recaídas no processo de emagrecimento sem desistir](https://www.nutricaoemovimento.com/pt/artigos/como-lidar-com-recaidas-no-processo-de-emagrecimento-sem-desistir) | 74 | C |
| 28 | [Detox funciona? O que seu corpo realmente precisa para se cuidar](https://www.nutricaoemovimento.com/pt/artigos/detox-funciona-o-que-seu-corpo-realmente-precisa-para-se-cuidar) | 81 | B |
| 29 | [Caminhada e alimentação: como começar a cuidar do corpo com mais leveza](https://www.nutricaoemovimento.com/pt/artigos/caminhada-e-alimentacao-como-comecar-a-cuidar-do-corpo-com-mais-leveza) | 74 | B |
| 30 | [Setembro Amarelo: alimentação e exercícios como parte do cuidado com a saúde mental](https://www.nutricaoemovimento.com/pt/artigos/setembro-amarelo-alimentacao-e-exercicios-como-parte-do-cuidado-com-a-saude-mental) | 72 | C |
| 31 | [Fome Emocional ou Fome Física? Aprenda a Identificar a Diferença](https://www.nutricaoemovimento.com/pt/artigos/fome-emocional-ou-fome-fisica-aprenda-a-identificar-a-diferenca) | 84 | B |

Arquivado: [#20 — Emagrecimento sustentável: hábitos que importam mais que força de vontade](https://www.nutricaoemovimento.com/pt/artigos/emagrecimento-sustentavel-habitos-que-importam-mais-que-forca-de-vontade), 301 para o artigo #4; excluído das classes do acervo publicado.
