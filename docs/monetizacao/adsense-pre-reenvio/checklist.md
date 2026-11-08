# Checklist pré-reenvio — estado em 08/11/2026

**70/100, AMARELO, recomendação C. Não reenviar hoje.** Caixa marcada significa que o aspecto explicitado foi verificado; não é atestado de conformidade integral nem de aprovação Google. Pendentes incluem falhas constatadas e pontos sem validação, discriminados abaixo.

- [ ] **ads.txt:** AUSENTE, 404 HTML; publisher/DIRECT/authority ID não verificáveis em arquivo inexistente. Google recomenda fortemente, sem obrigação universal.
- [ ] **CMP:** banner próprio identificado e defaults denied presentes; CMP certificada/TCF e adequação regional não confirmadas; falta validação de escolhas/armazenamento e reabertura acessível.
- [ ] **Políticas:** oito páginas 200, sem placeholders relevantes; corrigir divergências de Analytics, concordância por navegação, mecanismos Google e gerenciamento posterior. Newsletter também promete fluxo sem envio implementado.
- [ ] **Conteúdo:** 3 A + 17 B + 10 C + 0 D publicados; Lote 2 recomendado para #30, #22, #18, #9, #2 e #1, com aprovação de Weverlyn e validação pública posterior.
- [x] **Autoria:** perfil, nome completo/profissional, CRN 24101524 e vínculos Person/BlogPosting consistentes nos artigos observados. Processo de revisão confirmado pelo usuário; não houve verificação independente no conselho.
- [x] **Sitemap:** 200, 40 URLs (30 artigos + 10 estáticas), autora/Editorial presentes, #20 ausente, #4 com lastmod editorial correto. Cache anterior não reproduzido.
- [x] **Robots:** 200, conteúdo público permitido, admin/login/APIs bloqueados e sitemap correto. Não substitui noindex/autenticação/GSC.
- [x] **Canonical público:** artigos publicados e oito institucionais com canonical próprio www/HTTPS. Exceção operacional de login fica pendente abaixo.
- [x] **Redirects testados:** #20 → #4 em 301, sem www → www em 308, HTTP www → HTTPS em 301. Escopo das amostras, não varredura de todas as URLs.
- [ ] **Mobile:** código responsivo presente; home, listagem, artigo, Sobre, autora, Editorial e contato sem inspeção visual concluída; banner/menu/formulários também pendentes.
- [ ] **Performance:** PageSpeed 429; LCP/INP/CLS e First Load JS atual não medidos. GET único não é CWV.
- [ ] **Segurança:** produção com 0 críticos, 1 alto e 1 moderado; árvore completa 0 críticos, 1 alto e 8 moderados. Avaliar PostCSS/Next e runtime remoto; nenhuma atualização realizada.
- [ ] **Search Console:** sem exportação identificada/acesso utilizável. Confirmar cobertura/indexação, processamento do sitemap, canônicas, redirect e eventuais alertas; nada inventado.
- [ ] **AdSense connection:** loader/publisher confirmados em produção; vínculo/status da conta, Auto Ads, políticas e configuração regional não confirmados no painel.
- [ ] **Páginas operacionais:** login herda index/follow e canonical da home; script global em login/erro. Revisar noindex e escopo antes de veicular; admin sem sessão redireciona ao login.
- [ ] **Jornadas úteis:** resolver ou adequar busca sem ação e newsletter sem envio de confirmação implementado; não foram enviados formulários de teste.

## Encerramento desta auditoria

- [x] Consultas de conteúdo somente SELECT; HTTP somente leitura; comparação inicial/final sem mudança dos registros selecionados.
- [x] Somente documentos/evidências criados em `docs/monetizacao/adsense-pre-reenvio/`.
- [x] Nenhuma alteração de aplicação, artigos, banco, AdSense, CMP, cookies, políticas públicas, metadata, sitemap ou redirects.
- [x] Sem commit.
- [x] Sem push.
- [x] Sem deploy.
- [x] Correções não iniciadas automaticamente.

Critérios e ressalvas: [bloqueadores](bloqueadores.md), [relatório geral](relatorio-geral.md), [scorecard](scorecard.md), [evidências](evidencias.json).
