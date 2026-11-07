# Auditoria de dependências — 7 de novembro de 2026

Correções locais controladas, sem deploy, sem `npm audit fix --force` e sem Next 16. Código funcional, schema e dados do blog preservados.

## Estado de partida e resultado

O workspace já tinha alterações não commitadas em `package.json` e `package-lock.json`. A base desta auditoria é esse estado local, não o deploy descrito na solicitação: Next já estava em 15.5.24; Tiptap em 3.31.4; Sharp em 0.35.5; MariaDB em 3.5.4 por override. Essas alterações foram preservadas. Não foi executada auditoria remota na Hostinger.

Antes da primeira instalação foram executados `npm audit --json` e `npm ls next react react-dom sharp mariadb prisma @prisma/client @prisma/adapter-mariadb prosemirror-view brace-expansion`. Os registros estão em `audit-before.json`, `dependencies-before.txt` e `package-before.json`.

| Severidade | Antes | Depois |
| --- | ---: | ---: |
| Crítica | 1 | 0 |
| Alta | 28 | 1 |
| Moderada | 6 | 7 |
| Baixa / informativa | 0 | 0 |
| Total | 35 | 8 |

Os totais do npm incluem pacotes afetados por dependências vulneráveis; não representam 35 ou 8 falhas independentes. A contagem final é a do arquivo `audit-after.json`, não de uma etapa intermediária de instalação. `npm audit` termina com código 1 porque ainda existem alertas.

## Versões e origem

| Pacote | Tipo | Antes local | Depois |
| --- | --- | --- | --- |
| next | Direta | 15.5.24 | 15.5.29 exato |
| eslint-config-next | Direta, desenvolvimento | 15.5.24 | 15.5.29 exato |
| react / react-dom | Diretas | 19.1.1 | 19.1.1 |
| sharp | Transitiva opcional do Next | 0.35.5 | 0.35.5 |
| prisma | Direta | 7.8.0 | 7.10.1 exato |
| @prisma/client | Direta | 7.8.0 | 7.10.1 exato |
| @prisma/adapter-mariadb | Direta | 7.8.0 | 7.10.1 exato |
| mariadb | Transitiva do adapter | 3.5.4 por override | 3.5.4 declarada pelo pai |
| @tiptap/core, pm, react, starter-kit, extension-image, extension-link | Diretas | 3.31.4 | 3.31.4 |
| prosemirror-view | Transitiva de @tiptap/pm e módulos ProseMirror | 1.42.6 | 1.42.6 |
| brace-expansion | Transitiva de minimatch | 1.1.21 e 5.0.12 | 1.1.21 e 5.0.12 |
| @typescript-eslint/* | Transitivas de eslint-config-next | 8.61.0 | 8.72.1 |
| js-yaml | Transitiva de @eslint/eslintrc | Não registrada individualmente | 4.3.2 |
| source-map-js | Transitiva de PostCSS / Tailwind | 1.2.1 | 1.2.2 |
| nanoid | Transitiva de PostCSS | Não registrada individualmente | 3.3.20 |
| postcss usado por Tailwind | Transitiva | Não registrada individualmente | 8.5.32 |
| postcss interno do Next | Transitiva | 8.4.31 | 8.4.31 |
| zod | Direta | 4.4.3 | 4.6.7 |

As versões iniciais adicionais de transitivas podem ser conferidas no diff do lockfile e nos caminhos de `audit-before.json`. O lockfile também registra as transitivas corrigidas pela atualização do Prisma, como `mysql2`, `fast-uri` e ferramentas de desenvolvimento. As atualizações direcionadas usaram os intervalos aceitos pelos pais, sem `npm audit fix`.

### Next, Sharp e React

Next 15.5.29 e eslint-config-next correspondente estão disponíveis no registro npm. O peer dependency do Next aceita React 19.1.1. O Sharp continua transitivo em 0.35.5, sem dependência direta ou override.

O [advisory SVG GHSA-2464-fhr4-w9xw](https://github.com/advisories/GHSA-2464-fhr4-w9xw) informa correção em Next 15.5.28 e Sharp >=0.35.5. O [advisory AVIF GHSA-2xp9-vwfh-vxw4](https://github.com/advisories/GHSA-2xp9-vwfh-vxw4) informa correção em 15.5.24. O npm não aponta esses advisories na árvore final. A consulta ao NVD para CVE-2026-75604 não retornou conteúdo legível; não foi feita reprodução de exploit. A ausência no audit não substitui uma verificação de exposição do deploy antigo.

O diretório `node_modules/next/dist/docs/` solicitado pelo AGENTS.md não existe nesta distribuição. Para o teste de standalone foi consultada a [documentação oficial do Next 15](https://nextjs.org/docs/15/app/api-reference/config/next-config-js/output). Não houve alteração permanente em APIs, rotas ou `next.config.mjs`.

### MariaDB e Prisma

O adapter 7.8.0 fixava MariaDB 3.4.5, exigindo o override local preexistente. O adapter 7.10.1 declara 3.5.4 diretamente. Os três pacotes Prisma foram alinhados em 7.10.1 e o override foi removido. O registro também oferece MariaDB 3.5.5; manteve-se 3.5.4 por ser a versão declarada pelo adapter e não apresentar alerta no audit final. Não houve migração para major 4 nem mudança do schema/banco.

### ProseMirror e brace-expansion

ProseMirror View 1.42.6 já estava instalado através do Tiptap 3.31.4 no início. Não consta como vulnerável no audit final; não foi necessário atualizar novamente o editor nem adicionar override.

As duas cadeias de brace-expansion são:

- `@eslint/eslintrc → minimatch 3.1.5 → brace-expansion 1.1.21` (também deduplicada por ESLint e plugins).
- `eslint-config-next → @typescript-eslint/parser → typescript-estree → minimatch 10.2.6 → brace-expansion 5.0.12`.

Nenhuma dessas versões de brace-expansion consta no audit final. A dependência vulnerável restante nessa segunda cadeia é o próprio Minimatch. A atualização do pacote pai TypeScript ESLint para 8.72.1 não eliminou esse alerta; o pai continua declarando `^10.2.2`.

## Overrides e riscos residuais

**Nenhum override permanece no resultado final.**

Foi tentado um override restrito ao PostCSS do Next para 8.5.32. `npm install` / `npm update postcss` mantiveram a resolução 8.4.31 e `npm ls postcss` sinalizou `invalid`. O override foi retirado e a instalação consolidada novamente. O build bem-sucedido usou PostCSS 8.4.31; portanto, não comprova compatibilidade da versão substituta. A correção desse item requer uma avaliação separada da resolução e do pipeline CSS, ou atualização do Next 15 que inclua o pacote corrigido.

Restam dois grupos de causa:

- **PostCSS 8.4.31 interno do Next:** alta, com alertas de leitura de source maps e XSS na serialização. Advisories: [GHSA-6g55-p6wh-862q](https://github.com/advisories/GHSA-6g55-p6wh-862q), [GHSA-r28c-9q8g-f849](https://github.com/advisories/GHSA-r28c-9q8g-f849), [GHSA-fxqj-rqcc-2cmp](https://github.com/advisories/GHSA-fxqj-rqcc-2cmp), [GHSA-qx2v-qp2m-jg93](https://github.com/advisories/GHSA-qx2v-qp2m-jg93). O audit também marca Next como afetado por dependência. A exposição concreta depende do tratamento de CSS/source maps; não foi demonstrada exploração no blog.
- **Minimatch 10.2.6:** moderada, [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249), propagada para cinco pacotes TypeScript ESLint. O intervalo corrigido indicado pelo audit começa em 11.0.1, fora da major aceita pelo pai. Uso ligado às ferramentas de lint; não foi forçada a major 11.

O projeto teve redução dos alertas, mas não está livre de vulnerabilidades conhecidas. O runtime remoto e suas bibliotecas nativas não foram auditados.

## Validações

Runtime de teste: **Node 22.23.4**, obtido de forma isolada com `npm exec --package=node@22`, sem substituir o Node global 24.14.1.

| Verificação | Resultado |
| --- | --- |
| npm install | Concluído; lockfile consolidado |
| npm audit --json | 8 ocorrências: 0 críticas, 1 alta, 7 moderadas |
| npm ls dos pacotes solicitados | Código 0, sem invalid/missing nas cadeias solicitadas; ver dependencies-after.txt |
| prisma generate | Passou, Client 7.10.1 |
| prisma validate | Passou |
| eslint src | Passou: 0 erros, 2 avisos preexistentes |
| tsc --noEmit | Passou |
| npm run build com Node 22 | Passou, 35 páginas geradas; App Router e middleware compilados |
| Build standalone temporário | Passou; server.js iniciou localmente com Node 22 |
| Conexão Prisma/adapter/MariaDB | SELECT 1 passou, sem escrita de dados |
| git diff --check | Passou |

Avisos do lint: `<img>` em `src/app/administracao/seguranca/page.tsx:100`; import `destroySession` não utilizado em `src/components/admin/AdminLayout.tsx:3`.

O primeiro build falhou com `EINVAL readlink` no cache `.next/diagnostics/build-diagnostics.json` existente no OneDrive. Após afastar esse cache e reconstruir, o build passou. O modo standalone foi habilitado apenas durante o teste e `next.config.mjs` foi restaurado. O projeto continua com sua configuração de saída original. Para testar o standalone, `public` e `.next/static` foram copiados para o artefato, conforme a documentação oficial; não houve deploy.

`npm ls --depth=0` mostrou alguns pacotes opcionais WASM como `extraneous` na instalação incremental, sem afetar as cadeias solicitadas. Recomenda-se instalação limpa a partir do lockfile no ambiente Linux de homologação; o sucesso local no Windows não valida os binários nativos da Hostinger.

## Smoke tests

Testes HTTP executados no build normal e no artefato standalone; resultados em `smoke-results.json` e `smoke-standalone-results.json`.

| Caso | Resultado |
| --- | --- |
| /pt, /pt/artigos, /pt/sobre, /pt/contato | HTTP 200 |
| Artigo individual publicado encontrado na listagem | HTTP 200 |
| sitemap.xml, robots.txt, feed.xml | HTTP 200 e tipos XML/texto/RSS esperados |
| /login | HTTP 200 |
| /administracao sem sessão | 307 para /login |
| /administracao/artigos/novo sem sessão | 307 para /login |
| Host sem www, com caminho e query | 308 para HTTPS www, preservando caminho e query |
| Host com www | HTTP 200, sem loop de redirecionamento |
| next/image com imagem real Cloudinary | HTTP 200, Content-Type image/png |
| Upload com formulário vazio | HTTP 400 esperado |
| MariaDB via Prisma | SELECT 1 passou |

**Não validados ponta a ponta:** login com credenciais/2FA, editor autenticado e salvamento, upload real que grave na Cloudinary e interação visual/hidratação do carrossel. Não foram fornecidas credenciais de teste nem foi criada sessão artificial. A compilação dessas telas e a resposta HTTP das páginas não comprovam esses fluxos. Não foram publicados artigos nem enviados arquivos reais à Cloudinary. O teste de imagem comprova a leitura/otimização de um asset existente.

## Node 22 e Hostinger

`engines.node` passou de `>=22` (estado local inicial) para **`^22.12.0 || ^24.0.0`**, alinhado às linhas LTS compatíveis com Prisma e ao mínimo do ramo 22. O warning de `@prisma/streams-local` com Node 20 também deixa de se aplicar no Node 22 testado. [Requisitos oficiais do Prisma 7](https://www.prisma.io/docs/orm/v7/reference/system-requirements).

**A Hostinger ainda precisa ser configurada manualmente para Node 22, versão 22.12 ou posterior.** Alterar package.json não troca o runtime 20.19.4 do servidor. Confirmar a versão usada tanto no build quanto na execução, reinstalar a partir do lockfile e repetir os fluxos autenticados em homologação antes de publicar. Nenhuma configuração remota, restart, commit, push ou deploy foi executado nesta tarefa.

## Arquivos

- `package.json`: Next e eslint-config-next 15.5.29; Prisma 7.10.1 alinhado; engines; remoção do override MariaDB. Alterações Tiptap preexistentes preservadas.
- `package-lock.json`: versões resolvidas e transitivas atualizadas.
- `docs/security/`: este relatório, snapshots inicial/final, auditoria intermediária e scripts/resultados de verificações somente de leitura.

Nenhuma alteração funcional persistente em `src/`, `prisma/` ou `next.config.mjs`.
