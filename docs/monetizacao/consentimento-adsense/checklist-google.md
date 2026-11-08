# AÇÃO HUMANA NO ADSENSE

08/11/2026. Nenhuma ação de painel foi executada por esta tarefa. A publicidade está pausada no código local; não há CMP certificada confirmada nem variável para ativar anúncios. Não marcar itens por mera presença de código.

- [ ] **Conta e publisher:** entrar na conta correta e confirmar `ca-pub-3638053236344020` / `pub-3638053236344020`. Se divergir, interromper a integração e reconciliar os registros; não escolher um dos IDs arbitrariamente.
- [ ] **Sites:** confirmar associação de `www.nutricaoemovimento.com`/domínio correto, status atual, motivo da rejeição e pendências específicas. Não solicitar nova revisão nesta fase.
- [ ] **Método de conexão:** conferir a opção oferecida pela conta para metadata `google-adsense-account` ou ads.txt. O Google documenta ambas como alternativas ao snippet de anúncios. O loader foi retirado deliberadamente; não repor um loader global para contornar verificação.
- [ ] **Após futura implantação autorizada:** abrir `/ads.txt`, conferir 200 e a linha exata, e conferir a metadata no HTML da home. Até lá, a última evidência pública é 404; os 200 desta entrega são locais.
- [ ] **ads.txt no painel:** comparar a linha fornecida pelo Google ao arquivo preparado, relacionamento DIRECT e authority ID. Confirmar reconhecimento após recrawl; a leitura pelo Google pode demorar. Não afirmar “autorizado” apenas porque o teste local passou.
- [ ] **Privacy & Messaging:** identificar se existe mensagem de regulamentações europeias para este domínio, se está publicada, quais idiomas, regiões e opções de consentimento/rejeição utiliza. Registrar fornecedor/ID/estado, sem credenciais.
- [ ] **CMP certificada:** se publicidade personalizada alcançar EEE, Reino Unido ou Suíça, confirmar fornecedor na lista certificada Google e integração TCF aplicável. O banner próprio não é essa CMP. Para estratégia não personalizada/limitada, verificar elegibilidade e exigências aplicáveis na conta, sem presumir dispensa geral de consentimento.
- [ ] **Brasil e outras regiões:** conferir mensagens/configurações aplicáveis ao tráfego real e ao tratamento escolhido. Não assumir que certificação regional atesta conformidade legal em todos os países.
- [ ] **Auto Ads:** registrar estado, formatos e exclusões existentes. Não ativar novos formatos/unidades nesta fase. Verificar superfícies sem propósito editorial e privadas antes de qualquer retomada.
- [ ] **Centro de políticas e alertas:** conferir restrições, consentimento, autorização do domínio e pendências específicas. Presença de publisher em HTML não prova conta aprovada.
- [ ] **Integração técnica futura:** depois das verificações, definir como carregar a CMP e receber o sinal adequado **antes** de retomar anúncios. A publicação de mensagem no painel não prova que ela funcione no código atual com loader removido. Não criar dependência circular “aceitar banner → carregar anúncio → mostrar CMP”.
- [ ] **Validação real após integração autorizada:** em sessões limpas e regiões aplicáveis, verificar novo usuário, rejeição, aceite granular, retorno, retirada, rede, cookies e TCF quando aplicável; evitar banners conflitantes. Não simular geolocalização como se fosse tráfego regional real sem registrar o método.
- [ ] **Somente então reavaliar reenvio:** considerar Lote 2, demais bloqueadores da auditoria e comportamento efetivamente publicado. Não clicar em solicitar revisão, publicar mensagens ou alterar configurações por conta desta checklist.

Nenhuma dessas etapas é prova automática de conformidade jurídica ou garantia de aprovação. A produção e o painel permanecem fora da validação local desta entrega.

Fontes oficiais: [conexão](https://support.google.com/adsense/answer/7584263?hl=en), [ads.txt](https://support.google.com/adsense/answer/12171612?hl=en), [CMP regional](https://support.google.com/adsense/answer/13554116?hl=en).
