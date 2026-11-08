# Correção controlada da newsletter — 8 de novembro de 2026

## Escopo e decisão

Reavaliação exclusiva de B1. O score histórico de 82/100 (AMARELO), as avaliações editoriais e os demais limites da auditoria permanecem registrados, sem recálculo. **GO PARA SEARCH CONSOLE condicionado à implantação autorizada e à conferência pública desta correção.** O bloqueador está corrigido no código local; a produção não foi alterada nesta etapa. Não submeter o site como se a correção já estivesse publicada.

## Comportamento anterior comprovado por código

A seção compartilhada aparecia na home, listagem e página de artigo. O header apontava para `/pt#newsletter`; o footer não tinha formulário. Não foi encontrada página autônoma ou modal de newsletter. A action normalizava o e-mail, aplicava limite por IP, fazia `upsert` de assinante pendente, gerava token com validade de 24 horas e chamava um adaptador sem entrega. O adaptador apenas registrava o link em desenvolvimento. Não havia fila nem provedor integrado. A rota de confirmação podia consumir token e registrar consentimento, mas isso não demonstrava double opt-in entregue por e-mail. Não havia unsubscribe operacional por link. O painel e a exportação administrativa são separados da captura pública.

A UI dizia “Enviamos um e-mail de confirmação”, oferecia conteúdos e saída da lista, inclusive por parâmetros de URL fornecidos pelo visitante. Privacidade e Termos já reconheciam a ausência de envio.

## Inventário anterior à alteração e preservação editorial

O arquivo [newsletter-ctas-inventario.json](newsletter-ctas-inventario.json) foi criado **antes** da alteração do template e relaciona os 19 registros com um card promocional dedicado dentro do HTML salvo. O inventário usou o snapshot da auditoria anterior; sua correspondência exata com o novo snapshot foi testada antes de concluir a correção.

Esses cards são ocultados somente na renderização da página pública. O filtro exige o título padronizado, um único link `/pt#newsletter` e o texto do botão da newsletter; não remove menções genéricas nem parágrafos editoriais. Os testes com todos os 31 registros demonstram que todos os bytes externos aos cards permanecem iguais. O helper original `articleBody`, o editor, os corpos, `contentBlocks`, propostas aprovadas e dados do feed não foram alterados. Não foi realizada nova revisão clínica ou editorial.

O carrossel da home recebia registros completos por props de componente cliente, expondo também os corpos antigos no payload RSC. Agora recebe somente os campos de card que utiliza, evitando transmitir ali os CTAs ocultados. Isso não muda os títulos, descrições, imagens, ordem ou métricas dos cards.

## Alterações funcionais

- Flag central explícita `NEWSLETTER_AVAILABLE = false`, sem variável de ambiente que possa reativá-la acidentalmente.
- Seção retorna `null`, sem wrapper ou espaço reservado, para qualquer parâmetro de status. Link do header oculto. Footer preservado.
- Inscrição interrompida na primeira instrução da action, antes de ler e-mail, IP, banco, token ou adaptador; redireciona a `/pt/artigos`, sem declarar inscrição/envio.
- Confirmação interrompida antes de consultar token ou assinante. GET retorna 503, texto informativo, `no-store` e `X-Robots-Tag: noindex, nofollow`. POST não suportado (405). Nenhum token é consumido durante a pausa.
- Arquitetura futura, adaptador, schema, painel e dados anteriores preservados. A reativação exige integração real e validação de entrega, consentimento e retirada; trocar a flag isoladamente não é critério suficiente.
- Ajustes pontuais em Privacidade e Termos: captura desativada, ausência de novos pedidos/confirmações/envios, cadastros anteriores preservados e contato para direitos/exclusão. Retenção continua declarada, sem inventar rotina automática. Cookies mantém a distinção verdadeira entre consentimento de cookies e cadastro anterior.

## Ocorrências remanescentes e indexabilidade

Busca global registrada em [newsletter-busca-global.log](newsletter-busca-global.log). Ocorrências em documentação, snapshots, scripts, fixtures e propostas são evidência histórica, não páginas servidas. Admin, exportação, editor e validador mantêm a arquitetura interna; as rotas administrativas continuam sujeitas à autenticação existente. Não foram criados novos endpoints de captura.

Na interface pública restam apenas menções informativas em **Privacidade, Termos e Cookies**, além do aviso honesto de serviço desativado na rota de confirmação. Nenhuma página fina foi criada. `/pt/newsletter`, `/api/newsletter`, `/api/newsletter/subscribe` e `/api/newsletter/unsubscribe` não possuem página/handler funcional. As strings do componente e do fluxo futuro permanecem no código, protegidas pela mesma flag e sem exibição pública. Os corpos promocionais salvos são mantidos no banco e ocultados apenas na página individual.

## Validação e limites

**Resultado concluído:** lint passou (somente os dois avisos preexistentes em segurança/AdminLayout); typecheck passou; build de produção passou; 20 testes passaram (4 da pausa da newsletter e 16 de consentimento); 51 verificações HTTP passaram, incluindo os 30 artigos. A primeira checagem HTTP detectou os corpos completos no payload do carrossel; a projeção dos campos corrigiu essa exposição e a checagem final também passou no HTML completo, incluindo scripts RSC. A resposta HTTP de confirmação inclui `no-store, no-cache, must-revalidate` por composição dos controles existentes. A integridade final confirmou os 31 artigos e os 10 assinantes, sem divergência editorial/estrutural ou alteração dos cadastros.

Resultados finais em `newsletter-tests.log`, `newsletter-lint.log`, `newsletter-typecheck.log`, `newsletter-build.log` e `newsletter-http-local.json`. Os testes da action e da confirmação usam dependências que lançam erro diante de qualquer acesso a banco/headers/provedor: comprovam a interrupção antecipada inclusive em chamadas diretas. Nenhum endereço real foi submetido. Os testes HTTP fazem GET sem executar JavaScript de artigos ou seus contadores; o único POST é para um método não implementado da rota de confirmação.

A checagem estrutural garante ausência da seção, de wrappers vazios próprios dela, dos links sem destino e dos cards promocionais, mantendo o footer. **Não houve inspeção visual interativa desktop/mobile**: o controle de navegador estava indisponível no ambiente. Essa conferência permanece no checklist humano, sem alegação de aprovação visual.

Foi necessário preservar o cache gerado de um build em `node_modules/.cache/` e regenerar `.next` após erro de filesystem `EINVAL/readlink` no OneDrive. Nenhum arquivo-fonte foi apagado; `.next/` continua ignorado pelo Git. A documentação Next instalada em `node_modules/next/dist/docs/` não existe nesta versão; foi consultada a [referência oficial de redirect do Next 15](https://nextjs.org/docs/15/app/api-reference/functions/redirect) antes das alterações.

## Integridade e quatro respostas

Snapshots próprios desta etapa: `newsletter-integridade-antes.json` e `newsletter-integridade-final.json`. Comparação dos 31 registros editoriais preserva todos os campos, permitindo somente incrementos legítimos de views conforme autorização anterior. Os 10 cadastros de newsletter são comparados por quantidade e SHA-256 dos registros completos em memória; e-mails e tokens não são exportados para esse snapshot. Nenhum dado foi apagado e nenhuma escrita no banco foi realizada pelo trabalho.

No build local corrigido:

| Pergunta | Resposta |
| --- | --- |
| A interface promete newsletter funcional? | NÃO |
| Ainda coleta e-mails para esse serviço não operacional? | NÃO |
| Há mensagem falsa de confirmação? | NÃO |
| As políticas continuam coerentes? | SIM |

Essas respostas dependem da implantação para se aplicarem à produção. A auditoria pública anterior não é substituída por uma alegação de deploy nesta etapa. Sem commit, push ou deploy; sem Resend, nova integração, migration ou alteração de artigos/banco editorial.

## Arquivos desta correção

- `src/config/newsletter.ts` — chave explícita de pausa.
- `src/components/sections/NewsletterSection.tsx` e `src/components/layout/Header.tsx` — ocultação da oferta.
- `src/app/pt/newsletter/actions.ts` e `src/app/api/newsletter/confirm/route.ts` — bloqueio antecipado no servidor.
- `src/lib/newsletter/public-display.ts` e `src/app/pt/artigos/[slug]/page.tsx` — filtro exclusivamente de apresentação dos cards documentados.
- `src/app/pt/page.tsx` — props do carrossel limitadas aos dados efetivamente utilizados.
- `src/app/pt/politica-de-privacidade/page.tsx` e `src/app/pt/termos-de-uso/page.tsx` — ajustes pontuais de transparência.
- `scripts/newsletter-disabled.test.ts`, `scripts/newsletter-public-check.mjs` e `scripts/newsletter-integrity.ts` — verificações reproduzíveis, sem escrita no banco.
- Nesta pasta: relatório geral, bloqueadores, checklist humano e anotação do scorecard; este relatório complementar, inventário prévio, snapshots de integridade, resultado HTTP e logs das verificações. Os scripts `adsense-final-*`/`audit-final-*` e os demais artefatos da auditoria anterior já estavam presentes antes desta correção.
