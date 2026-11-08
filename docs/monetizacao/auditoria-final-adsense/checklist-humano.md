# Checklist humano antes de solicitar revisão

Estado atualizado: **B1 corrigido localmente; GO PARA SEARCH CONSOLE após implantação autorizada e conferência pública.** Score histórico preservado: 82/100, AMARELO, sem recálculo. Nenhuma configuração de conta foi presumida ou alterada. Não clicar em “Solicitar revisão” como resultado automático deste documento. Sem deploy nesta etapa.

## 1. Encerrar a inconsistência de confiança B1

- [x] Desabilitar temporariamente a captura no código, ocultar oferta/estados e bloquear action/confirm antes do acesso ao banco.
- [x] Preservar os cadastros e os 31 registros editoriais; documentar os cards legados antes de ocultá-los apenas na exibição.
- [x] Registrar a correção local e atualizar a decisão condicionada em [newsletter-correcao.md](newsletter-correcao.md).
- [ ] Implantar somente em etapa expressamente autorizada; nenhuma implantação ocorreu agora.
- [ ] Reabrir home, listagem, artigos com e sem card legado e footer em desktop/mobile: sem lacuna, botão morto ou desalinhamento. Inspeção visual interativa não realizada neste ambiente.
- [ ] Na produção atualizada, conferir `/pt?newsletter=confirmar`, `sucesso`, `confirmado`, erros e links antigos: sem falsas confirmações ou oferta de inscrição.
- [ ] Conferir aviso 503/no-store/noindex da rota de confirmação, captura indisponível e Privacidade/Termos/Cookies coerentes, sem cadastrar e-mails reais para teste.
- [ ] Registrar a evidência pública para efetivar o GO. A correção local não comprova atualização da produção.

Não é uma exigência de ter newsletter. Não exige Lote 3, alteração dos quatro C ou implementação de uma plataforma de e-mail completa. A auditoria não submeteu nenhum e-mail nem testou entrega no host.

## 2. Google AdSense — conferência administrativa

- [ ] Confirmar a conta correta e o domínio `www.nutricaoemovimento.com`.
- [ ] Confirmar publisher `pub-3638053236344020` / client `ca-pub-3638053236344020`.
- [ ] Registrar status e mensagens atuais do site. “Requer atenção” e reprovação por baixo valor são o histórico informado, não uma tela consultada nesta auditoria.
- [ ] Em Sites/ads.txt, conferir o novo crawl. O arquivo público está em 200 text/plain com a linha correta; eventual painel antigo “Não encontrado” fica **AGUARDANDO CRAWL / CONFERÊNCIA HUMANA**.
- [ ] Na Central de políticas, verificar avisos específicos, restrições e ações pendentes; não presumir aprovação porque os testes técnicos passaram.
- [ ] Confirmar a modalidade de conexão utilizada. Metadata e ads.txt são opções oficiais; ausência de anúncios visíveis antes de aprovação não prova falha.
- [ ] Conferir Auto Ads e a intenção de veiculação. O site atualmente pausa publicidade; não ativar anúncios apenas para produzir uma prova visual de revisão.

## 3. Privacy & Messaging / CMP

- [ ] Abrir **AdSense → Privacy & Messaging** e registrar mensagens publicadas, domínio e regiões.
- [ ] Confirmar qual CMP certificada/integração TCF será utilizada para a veiculação aplicável.
- [ ] Distinguir a mensagem Google/CMP certificada do banner próprio do site. O banner próprio não comprova certificação, TC String ou configuração da conta.
- [ ] Conferir os requisitos regionais atuais antes de ativar publicidade nas regiões abrangidas.
- [ ] Se houver mensagem/CMP configurada, comprovar também carregamento e sinais efetivos no navegador; configuração do painel não é prova de integração técnica.
- [ ] Manter como **AÇÃO HUMANA** o que não puder ser comprovado. A falta de evidência de CMP, isoladamente e com publicidade pausada, não foi classificada como falha fatal de conteúdo.

Referências: [conectar o site](https://support.google.com/adsense/answer/7584263?hl=en) e [requisitos regionais de consentimento](https://support.google.com/adsense/answer/13554116?hl=en).

## 4. Consentimento e Analytics em produção

Utilizar perfil/janela de teste sem decisão anterior; não apagar indiscriminadamente os dados pessoais do navegador cotidiano. Na aba Network do DevTools, manter a gravação e observar também cookies/localStorage.

- [ ] **Novo visitante:** banner acessível; quatro defaults denied; ausência de loader GA/AdSense/GTM/Clarity antes de decisão. A fila local `dataLayer` não é requisição Google.
- [ ] **Recusar:** fechamento do banner, decisão negada persistida e nenhum loader opcional. Recarregar e confirmar a persistência.
- [ ] **Aceitar opcionais:** verificar que apenas Estatísticas é autorizada nesta versão, com Publicidade pausada. Conferir update antes de config e apenas um loader GA.
- [ ] **Preferências:** abrir pelo banner e pelo footer, salvar categoria e recusar sem navegar forçadamente.
- [ ] **Revogar depois do aceite:** confirmar denied, recarga e ausência de novo GA no documento seguinte; registrar limites da remoção de cookies e de dados já enviados.
- [ ] **Persistência/versionamento:** decisão continua após reload; escolha anterior inválida/vencida não é reaproveitada. Código/política declaram v2, `nem-consent-v2` e cookie `nem-consent`, até 180 dias.
- [ ] **Sem duplicação:** verificar a rede real; presença de ID no bundle é configuração, não uma requisição já feita.
- [ ] **Login/admin:** em documento novo, sem anúncios ou Analytics opcional; conferir também transição a partir de página pública após aceite.

Os 16 testes com mocks passaram, mas não substituem essas observações. Não houve esse teste interativo real nesta auditoria.

## 5. Mobile, experiência e performance

Conferir ao menos home, listagem, artigo com tabela/referências, autora, contato e painel de cookies em **320 px, 375 px, tablet (768/1023 px) e desktop (1440 px)**.

- [ ] Menu, busca do explorador, filtros e paginação funcionam com toque/teclado.
- [ ] Cards, textos, tabelas e URLs longas não ficam cortados. CSS com overflow hidden não comprova ausência de overflow.
- [ ] Banner e preferências permitem aceitar/recusar/salvar/reabrir sem botão inacessível; considerar rolagem do painel.
- [ ] Capas carregam e têm relação visual com o assunto; nenhum corte indevido. HTTP/MIME/alt não substituem essa revisão.
- [ ] Avaliar o alt categórico de alimentação consciente em futura manutenção autorizada.
- [ ] Inspecionar console/hydration e requisições quebradas; a auditoria não pôde confirmar sua ausência em runtime.
- [ ] Obter nova avaliação mobile/desktop de PageSpeed/Lighthouse, se disponível. A API retornou 429 nesta execução.
- [ ] Conferir LCP/CLS e dados de campo para INP quando existirem. TBT de laboratório não é INP, nem duração de GET é Web Vital.

A aprovação humana anterior dos dois artigos do Lote 2 é limitada àquela revisão; não demonstra a qualidade visual atual de todo o site ou do banner.

## 6. Segurança e operação

- [ ] Triar o PostCSS interno do Next, sem executar atualização automática indiscriminada.
- [ ] Confirmar o inventário/runtime hospedado; o npm audit desta rodada examinou o workspace, não arquivos privados do servidor.
- [ ] Avaliar se algum fluxo processa CSS não confiável. Não foi demonstrada exploração pública nesta auditoria, e o alerta alto não foi declarado resolvido.
- [ ] Preservar a separação entre alertas de desenvolvimento e de produção ao planejar correção.
- [ ] Em fase autorizada, avaliar metadata/noindex de login e o botão de busca inativo do header.
- [ ] Não abrir Lote 3 automaticamente: os quatro C precisam de manutenção proporcional, não foram considerados bloqueadores materiais isolados.

## 7. Search Console — próxima etapa do plano, não executada aqui

Após atualização da decisão de prontidão, conferir:

- [ ] Propriedade correta do domínio/www.
- [ ] Sitemap oficial `https://www.nutricaoemovimento.com/sitemap.xml`, processamento e data de leitura atuais. O relato anterior de 39 páginas encontradas é histórico; o XML público atual tem 40 URLs, não prova de 40 indexadas.
- [ ] Cobertura/indexação e canônica escolhida pelo Google para home, autora, consolidado e amostra dos lotes.
- [ ] Seis artigos do Lote 2 acessíveis e com datas/canonicals esperados.
- [ ] URL arquivada retorna 301 direto ao consolidado; ausência do arquivado no sitemap é intencional.
- [ ] Ações manuais, problemas de segurança e exclusões relevantes, sem presumir que a ausência de erro HTTP as descarte.
- [ ] Só então reavaliar a liberação de “Solicitar revisão” no AdSense com as demais ações humanas concluídas.

## Integridade desta etapa

- [x] Nenhum artigo alterado; 31 registros exatamente iguais antes/depois.
- [x] Nenhuma escrita no banco, política, código funcional ou dependência.
- [x] Nenhum e-mail, formulário ou mensagem enviado; somente GET/HEAD e arquivos de auditoria.
- [x] Nenhum commit, push ou deploy.
