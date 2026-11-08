# Bloqueadores, recomendações e manutenção

## Atualização de B1 — correção local

**B1 resolvido no build local; aguardando publicação autorizada e conferência pública. GO PARA SEARCH CONSOLE condicionado a essas duas etapas.** A captura foi pausada também na action e na rota de confirmação, sem gravação ou exclusão de dados. Oferta, formulário e mensagens enganosas foram ocultados; os cards legados são filtrados exclusivamente na exibição, com todos os corpos salvos preservados. Privacidade e Termos informam a pausa.

Validação e integridade documentadas em [newsletter-correcao.md](newsletter-correcao.md). Não há novo bloqueador editorial ou recálculo do score de 82/100. **A produção não foi corrigida por esta execução, pois não houve deploy.** Os achados abaixo são o registro histórico da auditoria pública anterior.

---

**Decisão: NO-GO temporário — AMARELO, 82/100.** A pontuação não substitui os critérios de saída. Nenhuma correção foi executada nesta auditoria.

## Bloqueador real identificado nesta recomendação

| ID | Achado confirmado | Por que importa | Critério objetivo de encerramento |
| --- | --- | --- | --- |
| B1 | A newsletter oferece recebimento de conteúdos e saída da lista. O estado público `/pt?newsletter=confirmar` afirma “Enviamos um e-mail de confirmação”. Privacidade/Termos dizem que o envio automático ainda não está integrado; o adaptador local não envia | Inconsistência de confiança e de expectativa em uma jornada pública repetida em todo o site. A divulgação honesta apenas na política não torna a mensagem de sucesso verdadeira | Em etapa autorizada, adequar a oferta e os estados da UI à capacidade real, ou comprovar a integração efetiva de entrega e retirada. Revalidar a interface publicada. Não é necessário abrir lote editorial, alterar artigos ou construir um serviço grande para eliminar a promessa indevida |

Evidência: [newsletter-evidencia.json](newsletter-evidencia.json), texto público de Privacidade/Termos em [evidencias-publicas.json](evidencias-publicas.json), `src/components/sections/NewsletterSection.tsx` e `src/lib/newsletter/send-confirmation.ts`. O GET inspecionou somente um estado de apresentação existente: não submeteu e-mail, acionou confirmação nem escreveu no banco.

**Não afirmamos que o Google obrigue newsletter ou que essa divergência cause rejeição automática.** É o critério interno e explícito desta recomendação, diante de uma avaliação de confiança. Não houve teste de envio real no host para declarar entrega impossível por observação de caixa postal.

## Recomendações antes do reenvio

| Item | Evidência/estado | Tratamento |
| --- | --- | --- |
| Consentimento em navegador real | Defaults e bundle atuais conferidos; 16 testes locais com mocks passaram. Aceitar/recusar/reabrir/revogar/persistir/rede real não foram testados em produção | Conferência humana em sessão limpa; a ausência do teste não foi convertida em falha comprovada |
| Mobile e performance | Browser host indisponível; PageSpeed mobile/desktop retornou 429. Possível corte de cards a 320 px pelo min-width e capas sem dimensões intrínsecas | Inspeção humana em 320/375/tablet/desktop; obter CWV quando possível. Não existem métricas ruins demonstradas nesta execução |
| Segurança | npm completo: 0 críticos, 1 alto, 8 moderados; recorte de produção: 0 críticos, 1 alto, 1 moderado | Triagem controlada do PostCSS interno do Next e confirmação do inventário hospedado. Não demonstrada entrada pública de CSS não confiável nem exploração remota; não declarar risco resolvido ou atualizar automaticamente |
| Login | 200, index/follow e canonical `/pt`; robots bloqueia login e admin exige autenticação | Ajustar metadata operacional em fase autorizada; bloqueio robots não equivale a noindex confirmado pelo Google |
| Busca do header | Botão sem handler no código; busca do explorador é outra ferramenta | Corrigir ou adequar o affordance em etapa autorizada, sem confundir com indisponibilidade de todo o acervo |
| Referências legadas | Alguns títulos e instituições sem identificação suficiente | Manutenção prioritária e proporcional; não é ordem de criar Lote 3 nem condição de corrigir todos os B |

## Ações humanas, sem falha fatal presumida

- Confirmar conta/site/publisher e o status “Requer atenção”, fornecido pelo usuário, na Central de políticas do AdSense.
- Conferir ads.txt no painel. O arquivo público já está correto; estado antigo “Não encontrado” é **AGUARDANDO CRAWL / CONFERÊNCIA HUMANA**.
- Privacy & Messaging, CMP certificada/TCF e regiões: **não comprovados administrativamente**. O banner próprio não é CMP certificada. Publicidade está pausada; isso não foi classificado como falha fatal de conteúdo.
- Conferir Auto Ads sem ativação automática. Metadata e ads.txt são modalidades oficiais de conexão; ausência de loader e anúncios visíveis antes da aprovação não é bloqueio por si só.
- Preparar Search Console para a etapa seguinte: indexabilidade pública não comprova indexação. O processamento anterior com 39 páginas é histórico, não resultado desta execução.

## Manutenção futura

- Quatro C: melhorar referências/recortes e integridade de cópia; **não impedem isoladamente o reenvio**. Riscos por artigo em [quatro-c.json](quatro-c.json).
- Campos `seoTitle`/`seoDescription`: consumo incompleto é **RECOMENDAÇÃO**, pois título e description públicos atuais são úteis e canônicos.
- Curadoria de relacionados, uma ligação contextual adicional a #16, duas etapas em HTTP sem www e alt “Benefícios Comprovados” merecem melhoria proporcional.
- Referências mais completas, melhor delimitação de alegações causais e acompanhamento de conteúdos YMYL permanecem responsabilidade editorial contínua, não busca de perfeição artificial.

Não são bloqueadores demonstrados: número de artigos, existência de C, ausência de banners de anúncios, falta de resultado PageSpeed, ausência de prova administrativa de CMP isoladamente ou o fato de usar IA com revisão e responsabilidade humanas declaradas.
