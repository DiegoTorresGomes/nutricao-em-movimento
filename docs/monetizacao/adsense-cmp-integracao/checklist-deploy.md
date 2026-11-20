# Checklist para deploy posterior

Nenhum deploy autorizado ou executado nesta etapa.

- [x] Decisão confirmada pelo usuário: preservar `/` → `/pt`. A origem responde 307 sem loader; o AdSense executa apenas no destino. Nenhum redirect ou canonical alterado.
- [ ] Após deploy, confirmar `/` diretamente sem seguir redirects: 307, Location `/pt`, zero loaders. Consultar o destino: 200, exatamente um descritor afterInteractive e defaults anteriores à execução.
- [ ] Repetir ausência de loader em feed.xml, sitemap.xml, robots.txt, manifest, ads.txt e assets, além de login/admin/API.

LOCAL: Node 24.14.1 PASS. HOSTINGER: validar Node 22 no deploy; a versão local não constitui erro.

- [ ] Revisar diff e limites descritos no relatório; aprovar separadamente publicação.
- [ ] Executar lint, typecheck e build em Node 22 do destino. Validar NEXT_PUBLIC_GA_ID=G-HDJ55H8QR6 no ambiente de build, sem duplicar tag por GTM ou host.
- [ ] Conferir site e variante www cadastrados na CMP/AdSense. A configuração de mensagem foi informada para nutricaoemovimento.com; o projeto redireciona para www.nutricaoemovimento.com. Confirmar cobertura do hostname canônico no painel.
- [ ] Conferir mensagem publicada, Consent Mode ads e analytics habilitados, Auto Ads ativo, publisher correto e ads.txt acessível. Não criar slots.
- [ ] Confirmar defaults antes da execução do script, uma tag AdSense no DOM público, metadata correta e nenhuma publicidade em login/2FA/admin/API. Testar transição SPA e navegação programática: o guard recarrega ao sair do público; verificar ausência de tags após o novo documento.
- [ ] Executar os cenários reais A–E de testes.md, com preview oficial `?fc=alwaysshow&fctype=gdpr`, sem persistir parâmetro em código.
- [ ] Em EEE/UK/CH, verificar que só a mensagem Google solicita consentimento; estatísticas não seguem preferência local antiga. Recusar/grantar e revisar pela reabertura oficial.
- [ ] Fora do escopo Google, confirmar banner local, aceite/recusa de estatísticas e persistência 180 dias; nenhum update local de ads. Ads conservadoramente denied fora da região não representam autorização dada pelo banner.
- [ ] Testar bloqueadores/CMP indisponível: GA bloqueado, nenhuma concessão automática, footer informa espera. Avaliar essa limitação operacional antes da publicação.
- [ ] Capturar Network e console: separar loader de requisição de anúncio; procurar duplicação, TCF, consentimento, hydration, adsbygoogle e CSP. Confirmar GA único e page_view sem duplicidade.
- [ ] Inspecionar CSP real do host/CDN. Só adicionar origens estritamente necessárias com base em violações observadas e documentação oficial.
- [ ] Verificar políticas e preferências no desktop/mobile. Não inferir aprovação AdSense pela presença da tag, nem erro pela ausência de anúncios em revisão.
