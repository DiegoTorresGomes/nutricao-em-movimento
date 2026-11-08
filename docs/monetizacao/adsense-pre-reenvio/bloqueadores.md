# Bloqueadores e prioridades — 08/11/2026

Decisão atual: **C — Lote 2 + outras correções técnicas e de consentimento; não reenviar hoje.** A palavra bloqueador abaixo descreve o critério desta auditoria, não uma garantia de rejeição Google ou uma regra universal de elegibilidade.

## Bloqueadores absolutos nesta recomendação

| Item | Evidência e motivo | Critério para encerrar |
|---|---|---|
| Qualidade dos seis artigos de maior risco editorial | #30, #22, #18, #9, #2 e #1 ainda C. Referências amplas/não identificadas, mecanismos insuficientes ou intenção parcialmente atendida em temas de saúde; relevante diante da rejeição anterior por baixo valor | Lote 2 com fontes rastreáveis ligadas às afirmações, exemplos e limites próprios, sem promessas/diagnósticos; revisão/aprovação de Weverlyn e conferência do conteúdo realmente publicado |
| Coerência entre consentimento, políticas e operação | Política chama Analytics de futuro apesar do loader público; continuidade de navegação tratada como concordância; promessa de gerenciamento posterior sem controle de reabertura encontrado. Código de loader não fica integralmente bloqueado até escolha | Textos coerentes com o comportamento escolhido, rejeição e revisão/revogação acessíveis; teste não invasivo em sessão limpa demonstrando estados e armazenamento, distinguindo pings de cookies |
| Definição e comprovação de consentimento para a publicidade planejada | Banner próprio não prova CMP certificada/TCF; não houve acesso à configuração regional da conta | Confirmar regiões e formato; se houver publicidade personalizada no EEE/Reino Unido/Suíça, comprovar CMP certificada/TCF ativa. Para outra estratégia, documentar a aplicabilidade e validar a solução efetiva; não basta declarar que o banner próprio é certificado |

São três critérios de saída, não três incidentes independentes nem três exigências universais do Google. A exigência de CMP depende da veiculação e da geografia. Nada nesta fase autoriza alteração de artigos, políticas ou consentimento.

## Bloqueadores recomendados

| Prioridade | Item atual | Ação futura e prova de conclusão |
|---|---|---|
| Alta | ads.txt AUSENTE: 404 HTML | Confirmar linha na conta, publicar em fase autorizada e comprovar 200 text/plain com publisher correto. Altamente recomendado pelo Google, não obrigação universal para aprovação |
| Alta | Loader AdSense global, inclusive login e erro; admin autenticado não observado | Restringir inventário/loader conforme propósito; conferir runtime para não veicular em superfícies sem conteúdo editorial. Presença do script não demonstra infração consumada |
| Alta | Login herda index/follow e canonical `/pt`; robots bloqueia mas não garante desindexação | Definir metadata/noindex apropriados para páginas operacionais e conferir resposta; não alterar bloqueios de modo automático |
| Alta | PostCSS interno do Next com alerta alto; Next moderado transitivo | Avaliar exploração aplicável, versões corrigidas compatíveis/mitigação e runtime hospedado em fase de segurança. Não presumir exploit nem ignorar o risco; não atualizar nesta auditoria |
| Média | Newsletter anuncia entregas, adaptador de confirmação sem envio real | Implementar/validar serviço ou adequar promessa em fase autorizada. Não marcar dupla confirmação ou entrega como funcional sem evidência |
| Média | Busca no header sem ação | Implementar ou adequar o controle visível; conferir jornada do leitor |
| Média | Mobile e CWV não validados | Inspecionar as sete superfícies e banner em tela pequena, coletar PageSpeed/Lighthouse e dados de campo quando disponíveis. Corrigir falhas demonstradas, sem inventar métricas |
| Média | Search Console sem dados utilizáveis | Conferir cobertura da canônica, sitemap processado, inspeção de B/redirect A e páginas recentes; ações manuais/segurança. Não há número de URLs indexadas confirmado |
| Média | Conta AdSense e Auto Ads não consultadas | Confirmar domínio/publisher, conexão, mensagens de políticas, ads.txt e Privacy & Messaging no painel. Loader público não comprova esses estados |

Recomenda-se tratar esses itens antes de reapresentar o site, sobretudo ads.txt e escopo de anúncios. Um item pode ser encerrado por evidência de não aplicabilidade ou risco avaliado; ausência de métricas, por si só, não prova reprovação automática. Não há indicação de que o cache antigo da consolidação ainda bloqueie algo: sitemap/listagem/perfil/feed atuais já excluem A.

## Melhorias futuras

- Reavaliar os quatro C restantes (#27, #17, #23 e #7) após o Lote 2; um lote adicional de manutenção pode ser útil, sem torná-lo obrigatório hoje.
- Refinar relacionados automáticos e recortes temáticos, sem consolidar indiscriminadamente artigos com intenções diferentes.
- Preferir lastmod significativo nas páginas estáticas; ampliar acesso à autora no footer se ajudar navegação.
- Aperfeiçoar imagens, fontes e JavaScript com base em métricas reais; não otimizar por números inventados.
- Se houver afiliados/patrocínio/produtos, identificar relações comerciais e preservar autonomia clínica/editorial.

Não recomendar remoção de páginas legais curtas, publicação artificial em massa ou expansão por contagem de palavras. Não há necessidade demonstrada de dois lotes obrigatórios ou revisão integral dos 30 antes do reenvio.

Fontes e evidências: [relatório](relatorio-geral.md), [Google: prontidão](https://support.google.com/adsense/answer/12176698?hl=en), [ads.txt](https://support.google.com/adsense/answer/12171612?hl=en), [CMP regional](https://support.google.com/adsense/answer/13554116?hl=en).
