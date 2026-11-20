# Checklist para deploy posterior

Nenhum deploy autorizado ou executado nesta etapa.

- [x] Decisão confirmada pelo usuário: preservar `/` → `/pt`. A origem responde 307 sem loader; o AdSense executa apenas no destino. Nenhum redirect ou canonical alterado.
- [ ] Após a implantação autorizada, confirmar que `/` devolve 307 para `/pt` sem loader. Abrir o HTML inicial do destino e de um artigo. Confirmar uma tag AdSense nativa no head, com o publisher correto, precedida pelo inline com os quatro defaults `denied`. No DOM, conferir a ausência de `data-nscript` na tag AdSense.
- [ ] Repetir ausência de loader em feed.xml, sitemap.xml, robots.txt, manifest, ads.txt e assets, além de login/admin/API.

LOCAL: Node 24.14.1 PASS. HOSTINGER: validar Node 22 no deploy; a versão local não constitui erro.

- [ ] Revisar diff e limites descritos no relatório; aprovar separadamente publicação.
- [ ] Executar lint, typecheck e build em Node 22 do destino. Validar NEXT_PUBLIC_GA_ID=G-HDJ55H8QR6 no ambiente de build, sem duplicar tag por GTM ou host.
- [ ] Conferir site e variante www cadastrados na CMP/AdSense. A configuração de mensagem foi informada para nutricaoemovimento.com; o projeto redireciona para www.nutricaoemovimento.com. Confirmar cobertura do hostname canônico no painel.
- [ ] Conferir mensagem publicada, Consent Mode ads e analytics habilitados, Auto Ads ativo, publisher correto e ads.txt acessível. Não criar slots.
- [ ] Confirmar defaults antes da execução do script, uma tag AdSense no DOM público, metadata correta e nenhuma publicidade em login/2FA/admin/API. Testar transição SPA e navegação programática: o guard recarrega ao sair do público; verificar ausência de tags após o novo documento.
- [ ] Abrir `https://www.nutricaoemovimento.com/pt?fc=alwaysshow&fctype=gdpr` em perfis limpos. Registrar requisições, iniciadores e bloqueios no Network. Confirmar o carregamento de `adsbygoogle.js`, a ausência do aviso `data-nscript`, a execução de `CONSENT_API_READY` e `CONSENT_MODE_DATA_READY`, a disponibilidade de `__tcfapi` e a exibição da mensagem europeia.
- [ ] Testar aceite e recusa em perfis separados. Recarregar para confirmar a persistência e reabrir as preferências pelo rodapé. No Tag Assistant, conferir os quatro defaults e os sinais após cada escolha, com GA inativo antes da permissão de estatísticas.
- [ ] Se a tag passar nas verificações e a mensagem continuar ausente, registrar o resultado de entrega como pendente e solicitar ao Google confirmação da associação da mensagem ao host e à rota, da elegibilidade e do efeito da situação de revisão sobre o preview.
- [ ] Em EEE/UK/CH, verificar que só a mensagem Google solicita consentimento; estatísticas não seguem preferência local antiga. Recusar/grantar e revisar pela reabertura oficial.
- [ ] Fora do escopo Google, confirmar banner local, aceite/recusa de estatísticas e persistência 180 dias; nenhum update local de ads. Ads conservadoramente denied fora da região não representam autorização dada pelo banner.
- [ ] Testar bloqueadores/CMP indisponível: GA bloqueado, nenhuma concessão automática, footer informa espera. Avaliar essa limitação operacional antes da publicação.
- [ ] Capturar Network e console: separar loader de requisição de anúncio; procurar duplicação, TCF, consentimento, hydration, adsbygoogle e CSP. Confirmar GA único e page_view sem duplicidade.
- [ ] Inspecionar CSP real do host/CDN. Só adicionar origens estritamente necessárias com base em violações observadas e documentação oficial.
- [ ] Verificar políticas e preferências no desktop/mobile. Não inferir aprovação AdSense pela presença da tag, nem erro pela ausência de anúncios em revisão.
