# Scorecard final de prontidão

**Atualização de B1:** resolvido no código local; **GO PARA SEARCH CONSOLE após implantação autorizada e conferência pública**. Não houve deploy. Pontuação e fundamentação abaixo são históricas e não foram recalculadas. Ver [newsletter-correcao.md](newsletter-correcao.md).

08/11/2026. **82/100 — AMARELO — NO-GO temporário.** Não foi aberto Search Console nem solicitada revisão no AdSense.

| Categoria | Nota | Máximo | Fundamentação |
| --- | ---: | ---: | --- |
| Conteúdo editorial | 22 | 25 | 26 dos 30 publicados são A/B; exemplos, recortes e referências melhoraram. Os quatro C têm utilidade, com manutenção de fundamentação e redundância |
| E-E-A-T/YMYL | 13 | 15 | Autora, CRN, formação informada, revisão humana declarada, Person/Article e transparência sobre IA. Parte das referências legadas permanece genérica |
| SEO/indexabilidade | 14 | 15 | 30 artigos 200, canonical/schema corretos, feed/sitemap válidos e lastmod editorial. Login ainda herda index/follow e canonical da home |
| UX/mobile/performance | 6 | 10 | Navegação e recursos acessíveis; busca do header sem ação. Mobile e runtime não concluídos; PageSpeed 429, sem métricas CWV inventadas |
| Políticas/transparência | 8 | 10 | Políticas atuais reconhecem publicidade pausada e limites reais. Promessas da interface da newsletter conflitam com essa transparência |
| AdSense/ads.txt/consentimento | 11 | 15 | Publisher, ads.txt, metadata e defaults denied confirmados; ausência de loader inicial. Conta/CMP e cliques reais de consentimento não confirmados |
| Integridade técnica | 8 | 10 | XML, HTTP, recursos e comparação de integridade aprovados. Alertas transitivos e exposição do ambiente hospedado ainda merecem triagem |
| **Total** | **82** | **100** | **Acervo melhorou; uma inconsistência funcional de confiança impede esta recomendação de liberação** |

A nota é um julgamento interno com incerteza, não fórmula Google, probabilidade de aprovação, nota clínica ou cálculo automático a partir da média editorial 81,2. A média de artigos e este scorecard têm objetos e pesos diferentes.

O NO-GO não decorre automaticamente de haver quatro C, ausência de anúncios visíveis, falta de evidência de CMP certificada ou PageSpeed indisponível. Decorre da oferta pública da newsletter e do estado que afirma envio de confirmação, enquanto a própria política diz que esse envio não está integrado e o adaptador local é no-op. Não foi testada entrega real em produção; a contradição pública já é verificável.

Este é um critério prudente de confiança adotado pela auditoria, não uma regra Google de que todo site precisa ter newsletter. O critério para encerrar B1 é restrito e está em [bloqueadores.md](bloqueadores.md). Nenhum Lote 3 foi criado ou exigido.

Fontes primárias: [prontidão e experiência útil no AdSense](https://support.google.com/adsense/answer/12176698?hl=en), [valor do conteúdo](https://support.google.com/publisherpolicies/answer/11112688?hl=en), [conteúdo confiável e YMYL](https://developers.google.com/search/docs/fundamentals/creating-helpful-content). As classes e notas desta auditoria não são classificações dessas páginas.

Dados estruturados: [scorecard.json](scorecard.json). Evidências e limitações: [relatorio-geral.md](relatorio-geral.md).
