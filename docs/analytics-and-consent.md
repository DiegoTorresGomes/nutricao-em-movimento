# Analytics e consentimento

Atualizado em 20/11/2026. Implementação local, sem deploy.

O AdSense usa um único next/script afterInteractive no layout /pt, publisher ca-pub-3638053236344020. Os quatro defaults denied executam antes, no head global. Metadata e ads.txt preservados. Auto Ads e mensagens são geridos no painel Google; nenhum slot manual.

A Google CMP controla publicidade/TCF e estatísticas no seu escopo europeu. O bridge usa callbackQueue e getGoogleConsentModeValues: GRANTED/DENIED seguem Google, NOT_APPLICABLE habilita preferências locais e UNKNOWN/NOT_CONFIGURED mantêm GA bloqueado. O painel próprio permanece oculto no escopo Google e enquanto a aplicabilidade estiver pendente, inclusive sob bloqueadores. Não há fallback por tempo.

Fora desse escopo, o painel próprio controla apenas estatísticas. A preferência v2 persiste até 180 dias em localStorage nem-consent-v2 e cookie nem-consent, com fallback em memória. O painel atualiza somente analytics_storage e não sobrescreve os sinais publicitários. O campo legado ads=false não representa consentimento TCF.

GA é direto e único, condicionado a estatísticas concedidas, com NEXT_PUBLIC_GA_ID. Não há loader GA inicial no HTML. send_page_view:false permite controlar um page_view por URL em cada documento; Google Signals e personalização GA ficam desativados. GTM e Clarity legados não são montados.

Retirar estatísticas desativa GA, tenta limpar somente cookies GA acessíveis e recarrega se GA já executou. Isso não apaga cookies publicitários, dados já enviados ou cookies externos. O footer reabre preferências locais ou a mensagem Google via showRevocationMessage, conforme a autoridade. Enquanto a CMP estiver indisponível, informa espera e mantém o botão desabilitado.

Login/admin/API não montam o layout publicitário. O guard existente reconhece AdSense além de GA e força documento novo ao sair do público. Navegação programática depende do efeito desse guard e precisa de validação no navegador de destino.

Newsletter permanece sem provedor integrado. Não houve mudança de banco, sitemap, feed ou conteúdo editorial.

Veja [relatório e fontes oficiais](monetizacao/adsense-cmp-integracao/relatorio.md), [testes](monetizacao/adsense-cmp-integracao/testes.md) e [checklist](monetizacao/adsense-cmp-integracao/checklist-deploy.md). Testes locais de estado e HTML não comprovam sinais Google reais ou anúncios servidos.
