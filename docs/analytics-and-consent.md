# Analytics e preferências de cookies

Atualizado em 08/11/2026. Esta documentação descreve o código local; não houve deploy.

## Modelo atual

- Banner próprio de consentimento, **sem certificação Google/IAB/TCF**.
- Mesma experiência no Brasil, EEE, Reino Unido, Suíça e demais regiões; não há geolocalização.
- Necessários sempre ativos. Estatísticas desativadas inicialmente. Aceitar opcionais autoriza apenas estatísticas; publicidade está pausada e seu controle é desabilitado.
- Google Analytics direto, quando NEXT_PUBLIC_GA_ID está configurado, só é solicitado após consentimento positivo. O servidor não inclui loader remoto no HTML inicial. Isso bloqueia também os pings do GA antes da escolha; o script local de defaults não faz requisições.
- Consent Mode sempre inicializado no head: analytics_storage, ad_storage, ad_user_data e ad_personalization começam denied. Após escolha, somente analytics_storage pode mudar para granted. Os três sinais publicitários permanecem denied.
- O footer abre Preferências de cookies; é possível revisar, recusar, salvar ou fechar sem alterar uma decisão existente. A recusa tem o mesmo acesso e estilo que aceitar na primeira camada.
- Ao retirar estatísticas já carregadas, a aplicação envia denied, marca ga-disable, tenta remover cookies opcionais próprios conhecidos e recarrega a página. Remover um elemento script não encerra código já executado; por isso há recarga. Dados já enviados e cookies de domínios externos não são apagados por esse mecanismo.
- A decisão v2 fica em localStorage nem-consent-v2 e cookie nem-consent, até 180 dias, com data e categorias. O cookie permite fallback quando localStorage está bloqueado; ambos podem ser impedidos pelo navegador. Sem persistência a escolha vale em memória e pode ser pedida novamente depois. Não há registro centralizado de consentimento nem prova jurídica automática.
- V1, estados malformados e escolhas vencidas não são reutilizados. Eventos na página e alterações de armazenamento entre abas atualizam o estado.

## Publicidade e verificação

O publisher público confirmado é ca-pub-3638053236344020, centralizado em src/config/monetization.ts. public/ads.txt contém a linha DIRECT correspondente; teste automatizado verifica igualdade. A metadata google-adsense-account permite preparar a verificação sem carregar anúncios.

**O loader AdSense foi retirado. Não há botão ou variável que ative publicidade nesta entrega.** Não foram adicionadas unidades ou formatos. A confirmação de CMP/região depende da conta Google; uma integração futura deve ser revisada antes de reintroduzir o loader. O banner próprio e Consent Mode não substituem essa integração. Consulte [checklist Google](monetizacao/consentimento-adsense/checklist-google.md).

## Scripts preparados que não são montados

GTM e Clarity não são carregados. Os componentes legados permanecem no repositório, mas não são montados pelo layout. NEXT_PUBLIC_GTM_ID e NEXT_PUBLIC_CLARITY_ID sozinhas não os ativam. Auditar tags remotas, finalidades e categorias antes de qualquer integração futura; não duplicar GA/AdSense pelo GTM.

## Páginas operacionais

Analytics é montado somente no PublicLayout. Login/admin/API/erro não recebem loader publicitário ou GA em documento novo. Navegação client-side para fora de /pt faz documento novo quando GA já executou, evitando que o código público sobreviva ao acesso ao login/admin. O guard no layout global não carrega recursos externos. O banner não é montado na área privada.

## Newsletter

O formulário e fluxo de confirmação estão preparados, mas src/lib/newsletter/send-confirmation.ts não envia e-mail. Não foram implementados provedor, descadastro ou rotina automática de retenção nesta etapa. Políticas foram ajustadas para informar essa limitação; outros CTAs da newsletter ainda precisam de revisão própria. Não testar envio/submissão em produção para validar cookies.

## Verificações

Execute node --import tsx --test scripts/consent.test.ts, npm run lint, npx tsc --noEmit e npm run build. Testes de estado usam mocks e o componente real; não provam layout mobile, cookies reais do Google ou anúncios efetivamente servidos.

Fontes: [Consent Mode](https://developers.google.com/tag-platform/security/guides/consent), [conexão AdSense por metadata/ads.txt](https://support.google.com/adsense/answer/7584263?hl=en), [CMP regional](https://support.google.com/adsense/answer/13554116?hl=en).
