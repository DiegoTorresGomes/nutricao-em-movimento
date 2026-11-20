# Checklist Google: validação da Alternativa A

Marque cada item antes de considerar a mudança concluída. Itens com "(EEE)" exigem um acesso real a partir do EEE, Reino Unido ou Suíça. Simular geolocalização não vale como única evidência.

## Antes de implementar

- [ ] Revisão jurídica do banner próprio para estatísticas (LGPD; GDPR e ePrivacy para visitantes do EEE).
- [ ] Textos novos das Políticas de Cookies e de Privacidade aprovados.
- [ ] Revisão do AdSense concluída, ou risco de mudar a interface durante ela aceito por escrito.
- [ ] Conferir, na página da política de consentimento da UE do Google, a informação sobre o uso de IP para medição a partir de agosto de 2026, e ajustar a Política de Privacidade se for o caso.

## Painel GA4 (`G-HDJ55H8QR6`)

- [ ] Enhanced Measurement → "Alterações de página com base em eventos do histórico do navegador" **ativo** (dependência de F3).
- [ ] Administrador → Configurações de consentimento: conferir o estado dos sinais de consentimento e entender o aviso sobre usuários do EEE ([GA4 14275483](https://support.google.com/analytics/answer/14275483)).
- [ ] Google Signals e personalização de anúncios seguem desativados no `config`; conferir se o painel está coerente.

## Painel AdSense (Privacidade e mensagens)

- [ ] Fase 1: **nenhuma mudança**. A mensagem europeia continua publicada, com Consent Mode para publicidade.
- [ ] Fase 2, só com aprovação: desmarcar "Enable consent mode for analytics purposes". A configuração vale para todas as mensagens europeias da conta ([16053245](https://support.google.com/adsense/answer/16053245)).
- [ ] Depois da fase 2, conferir no relatório de mensagens que as taxas de exibição e de consentimento não mudaram de forma anormal.

## Validação técnica, no Brasil, em navegador real sem antivírus que injete scripts

- [ ] Perfil novo: banner do site visível, rodapé só com "Preferências de cookies", nenhuma requisição `/g/collect`, sem `_ga`.
- [ ] Tag Assistant: `consent default` com 4× denied antes de qualquer tag; depois do aceite, `consent update` só com `analytics_storage=granted`.
- [ ] Hits com `gcs=G101` (publicidade negada, análise concedida).
- [ ] DebugView: `page_view`, `first_visit` e `session_start` só depois do aceite; cinco navegações geram cinco `page_view`.
- [ ] Recarga, nova aba e nova sessão: mesmo `cid`.
- [ ] Revogação pelo rodapé: recarga, `_ga` removido, nenhum hit depois.
- [ ] Recusa: nenhum hit; o banner não volta.
- [ ] `/login` e `/administracao`: sem GA e sem AdSense.
- [ ] AdSense: `adsbygoogle.js` continua em `/pt` com os defaults antes; nada muda nas requisições de anúncio.

## Validação no EEE

- [ ] A mensagem Google aparece e o banner do site fica recolhido enquanto ela está na tela.
- [ ] Depois da escolha no Google, o banner do site pergunta estatísticas (fase 1) uma única vez.
- [ ] **H1:** a CMP do Google emite `consent update` para `ad_*` depois da escolha (Tag Assistant).
- [ ] **H2:** com análise ON, a CMP emite `analytics_storage`, e a regra do site prevalece de forma restritiva logo em seguida. Com análise OFF (fase 2), a CMP não emite `analytics_storage`, e `getGoogleConsentModeValues` devolve `NOT_CONFIGURED` (4) para análise.
- [ ] O botão "Privacidade e publicidade (Google)" reabre a mensagem (`showRevocationMessage`), e a revogação de publicidade não altera estatísticas.
- [ ] O #418 não remove os iframes da CMP (`googlefcPresent`, `__tcfapiLocator`); se remover, abrir uma pendência específica.

## Fontes oficiais

- https://developers.google.com/tag-platform/security/guides/consent
- https://developers.google.com/funding-choices/fc-api-docs
- https://support.google.com/adsense/answer/16053245
- https://support.google.com/adsense/answer/16088460
- https://support.google.com/adsense/answer/16918505
- https://support.google.com/adsense/answer/13554116
- https://support.google.com/analytics/answer/14546213
- https://www.google.com/about/company/user-consent-policy-help/
