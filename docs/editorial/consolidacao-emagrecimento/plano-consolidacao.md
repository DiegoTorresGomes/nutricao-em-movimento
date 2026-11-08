# Plano de consolidação A → B — aplicação remota concluída

**Estado em 08/11/2026:** após a ativação do redirect pelo usuário, a aplicação remota autorizada foi concluída: B recebeu o texto aprovado, A foi arquivado e o 301 permanece ativo. Datas históricas e views preservadas; nota final de B 83/100, classe B. **Cache estático de sitemap/listagem/perfil pendente, aceito pelo usuário.** Ver [relatorio-final.md](relatorio-final.md). As instruções futuras abaixo são o registro histórico do planejamento, não indicam que os dados ainda aguardam aplicação. Nenhum novo deploy nesta execução.

Recomendação editorial, confiança média. Nenhuma etapa abaixo autoriza implementação nesta fase. Nova fase deverá validar a proposta com Weverlyn, conferir dados disponíveis de busca/links e receber autorização de execução.

## URLs e 301 proposto

**Manter B:** https://www.nutricaoemovimento.com/pt/artigos/emagrecimento-sustentavel-como-cuidar-do-corpo-com-equilibrio-nutricao-e-movimento

**Descontinuar A:** https://www.nutricaoemovimento.com/pt/artigos/emagrecimento-sustentavel-habitos-que-importam-mais-que-forca-de-vontade

Mapeamento futuro único, **301 permanente**:

`/pt/artigos/emagrecimento-sustentavel-habitos-que-importam-mais-que-forca-de-vontade`

→ `/pt/artigos/emagrecimento-sustentavel-como-cuidar-do-corpo-com-equilibrio-nutricao-e-movimento`

Resposta de servidor em um salto, com destino final 200 e sem loop ou cadeia. Não usar a home nem apenas trocar canonical como substituto da mudança. Não presumir que um helper de framework devolva 301: exigir o status solicitado no teste futuro. Não há configuração de redirect criada por este plano.

## O que incorporar, reduzir e preservar

| Origem em A | Tratamento sugerido em B | Justificativa para não copiar integralmente |
| --- | --- | --- |
| Introdução / força de vontade | Parágrafo e subseção visível sobre motivação variável, cansaço, barreiras e facilitar escolhas | Preserva a pergunta de quem chega pela URL A; elimina a segunda introdução geral. Não transformar motivação em causa única. |
| Definição e resumo | Uma definição e um resumo únicos em B | Mesma função; dois resumos não acrescentam decisão. |
| Dietas restritivas | Preservar a distinção entre restrição extrema e ajuste individual acompanhado | B já tem ciclo de rigidez; repetir a explicação ampliaria o guia sem utilidade. Conferir alegações com fontes pertinentes. |
| Hábito 1, refeições | Manter base prática de B e remeter ao guia de prato #12 | A repete arroz/feijão/proteína/vegetais; não perder nenhum exemplo exclusivo relevante. |
| Hábito 2, tudo ou nada | Integrar a retomada sem compensação na seção de flexibilidade | B já cobre sobremesas, eventos e sair do plano. Não repetir conclusão moral. |
| Hábito 3, ambiente | Incorporar organização explícita: opção prática disponível, compras possíveis, fruta visível e bases preparadas | É o melhor ganho de A, embora parte dos exemplos já exista em B. Unificar com a lista de organização e evitar exigir acesso/tempo que o leitor não tem. |
| Hábito 4, sinais/emoções | Aproveitar pergunta sobre necessidade de descanso/apoio, sem proibir comida | B já tem perguntas parecidas. Revisar distinções rígidas entre fome e desejo, seguindo limites do Lote 1, antes de publicar. |
| Hábito 5, movimento | Preservar B com cautela/segurança; não copiar lista de atividades de A | Mesmo argumento de movimento sem punição e começo gradual. |
| Hábito 6, sono | Incorporar explicitamente que sono/estresse importam, mas não causam emagrecimento automático | Limite útil de A; não duplicar mecanismo e recomendações gerais. |
| Hábito 7, metas | Unir à seção prática: escolher mudança possível e rever a dificuldade | Exemplos de caminhada/fruta/prato/água já estão em B. Qualquer ferramenta nova seria proposta nova, sujeita a revisão, não texto já aprovado. |
| Nutrição comportamental / não é perfeição | Mesclar nas seções de comportamento e flexibilidade | Diferença principalmente de rótulo/redação; preservar contexto e individualização. |
| Conclusão | Uma conclusão breve em B | Mesmos argumentos; nenhum conteúdo útil desaparece ao suprimir a segunda síntese. |
| FAQ | Fundir perguntas equivalentes; incorporar força de vontade e arroz/feijão somente se agregarem ao que o corpo responde | Dez + seis perguntas não são necessárias. Não afirmar resultado garantido nem “toda dieta falha”. |
| Leia também / newsletter | Preservar leituras de A onde o contexto pedir, com links relativos, e um CTA de newsletter | Destinos não são duplicados; mudar posição deve respeitar pertinência. Remover CTA repetido não elimina serviço educativo. |
| Referências / autora | Deduplicar documentos reais, conferir bibliografia e manter autoria/disclaimer de B | Evitar copiar instituição genérica para fingir suporte científico. Arquivar a lista original de A como histórico. |

Em B, preservar exemplos da primeira refeição, lanches, sinais além da balança, segurança do movimento, individualização e vínculo ao PDF complementar. Antes de reutilizar o PDF, verificar conteúdo, acesso e alinhamento com o guia final; isso não foi auditado aqui. Não apagar mídia apenas porque A deixaria de ser publicado.

## Estrutura final sugerida para B

H1 do template: **Emagrecimento sustentável: como cuidar do corpo com equilíbrio, nutrição e movimento**. Manter título/slug neste plano; remover apenas a repetição do título em H2 na futura versão revisada.

1. H2 O que significa emagrecimento sustentável?
2. H2 Por que força de vontade não sustenta tudo sozinha?
   - H3 Ambiente, acesso e rotina: facilitar o cuidado possível.
   - H3 Uma mudança de cada vez: metas pequenas e ajustes.
3. H2 Alimentação equilibrada sem regras extremas.
   - H3 Como compor refeições no dia a dia.
   - H3 Flexibilidade, porções e necessidades individuais.
4. H2 Movimento como cuidado, com segurança.
5. H2 Sono, estresse e comportamento alimentar.
   - H3 Perceber sinais e necessidades sem transformar isso em teste.
   - H3 Retomar a rotina sem compensações.
6. H2 Como começar e acompanhar mudanças além da balança.
7. H2 Quando buscar acompanhamento individual.
8. H2 Perguntas frequentes.
9. H2 Referências.

Resumo curto, CTA, material complementar e autoria devem ter posição funcional, sem títulos promocionais gigantes ou cópia duplicada. É desenho de estrutura, **não nova redação aprovada**. O guia não deve crescer pela simples soma dos dois textos; explicar o essencial e encaminhar a peças específicas.

## Referências a preservar e conferir

As listas originais estão no comparativo e nas cópias integrais. Preservar o conteúdo sustentado por documentos pertinentes; não exigir conservar toda entrada bibliográfica se ela não sustentar mais nenhuma afirmação final.

| Documento atual | Origem | Destino sugerido da referência |
| --- | --- | --- |
| Guia Alimentar para a População Brasileira | A e B | Uma entrada exata, com instituição, edição/ano e URL oficial conferidos; base de alimentação/contexto, sem promessa de emagrecimento. |
| OMS Physical activity | A | Conferir documento e relação com orientações gerais; pode coexistir com diretriz ou ser substituída por ela apenas após revisão da alegação, registrando o motivo. |
| WHO Guidelines on Physical Activity and Sedentary Behaviour | B | Preservar para atividade física/saúde se efetivamente usada, com ano/URL e escopo. Não são automaticamente a mesma referência que a página acima. |
| NIDDK — Eating & Physical Activity to Lose or Maintain Weight | A | Preservar como candidato para hábitos/rotina/manejo do peso, confirmando título, conteúdo e endereço oficial. Não inventar ano ou DOI. |
| Política Nacional de Alimentação e Nutrição | B | Preservar se houver afirmação de política/contexto alimentar que ela sustente; se não houver, registrar retirada por falta de pertinência, mantendo registro original. |
| Código de Ética e de Conduta do Nutricionista | A e B | Corrigir o nome institucional incompleto de B na proposta futura e conferir versão/vigência oficial; uma entrada apenas se necessária para comunicação profissional. Não sustenta fisiologia ou eficácia de emagrecimento. |
| Material CFN sobre antes/depois | A | Não migrar para o núcleo de hábitos: é comunicação ética profissional, ausente como assunto principal do guia. Preservar no arquivo histórico; não afirmar norma vigente sem conferência oficial. |

Referências sobre mecanismos de sono/estresse, manutenção do peso e formação de hábitos podem precisar ser identificadas em futura revisão científica. Não preencher lacunas com fontes não lidas nem descrever este plano como bibliografia pronta. Nenhuma referência foi inserida no site nesta fase.

## Links internos e CTA

O mapa completo de origens está ao final do comparativo, com âncoras reais. **Zero links contextuais dos 31 corpos apontam a A**; portanto não há substituição de corpo atualmente identificada para executar. Há cinco cards em artigos que apontam a A: B (#4), saciedade (#8), dietas restritivas (#9), déficit (#18) e retomada (#27). Há ainda ligação no perfil da autora e menções/dados em listagem e filtro. Estes últimos são saídas geradas, não cinco links editoriais gravados nos corpos.

Se A deixar de ser publicado, regenerar essas saídas para excluí-lo. Em B, nunca substituir o card de A pelo próprio B; ele deve dar lugar a outro artigo elegível. Nos outros quatro conjuntos, B é destino editorial possível quando não duplicar link já presente; a regra atual é automática e pode escolher outro post. Não prometer seleção manual sem suporte técnico. Verificar todos os conjuntos depois, independentemente da expectativa teórica.

Os quatro links contextuais que já chegam a B (saciedade #8, prato #12, pré-treino #14 e disposição #23) permanecem no destino correto. O link do corpo de B para relação com a comida (#3) deve continuar pertinente. As leituras de A para comer por emoção (#2) e mindful eating (#1) podem ser preservadas no trecho comportamental de B. Sugestões adicionais, se a revisão criar a necessidade: prato #12, déficit #18, movimento #21 e retomada #27. Nenhuma foi inserida.

Manter **um CTA educativo de newsletter**, sem repetir promessas de frequência não confirmadas. Preservar o recurso complementar de B após validar sua pertinência; não converter o plano em captação clínica nem adicionar formulário/CTA comercial não aprovado.

## Canonical, sitemap, feed, schema e histórico

1. **Canonical:** B autorreferente com www; A responde 301 a B, sem página 200 concorrente. Conferir também variantes de domínio/protocolo para evitar cadeias desnecessárias. Não configurar canonical de B apontando a A.
2. **Sitemap:** remover A dos registros publicados elegíveis; B permanece com a data editorial verdadeira. Não basta adicionar redirect e deixar A PUBLISHED: `sitemap.ts` seleciona publicados e poderia continuar listando-o.
3. **Feed:** A deixa de gerar item; B conserva URL/guid e publicação original. Atualizar descrição só na revisão autorizada. Não inventar uma publicação nova para promover o guia.
4. **Listagem/home/autora/cards:** excluir A das coleções e ItemList, preservar B, regenerar saídas e conferir ausência de auto-link/duplicação.
5. **Schema:** BlogPosting de B mantém author, mainEntityOfPage/canonical e datePublished; dateModified recebe a revisão editorial verdadeira. A redirecionada não precisa continuar servindo BlogPosting separado. Breadcrumbs de B continuam coerentes; não criar FAQPage/citation schema apenas por consolidar.
6. **Datas:** preservar `publishedAt` de B: `2026-06-22T22:17:05.717Z`. Não copiar a data de A (`2026-07-29T07:00:03.607Z`), somar histórico nem preencher revisão com updatedAt antigo. `editorialUpdatedAt` só após revisão real aprovada; `updatedAt` continua técnico.
7. **Views e autoria:** preservar ID/slug/conta técnica/views de B; não somar views de A, porque são contadores não equivalentes a leitores únicos. Registrar publicações, origens dos trechos incorporados, referências removidas com motivo e aprovação de Weverlyn em histórico editorial.
8. **Arquivo de A:** manter snapshot íntegro de texto, metadata, links e bibliografia para rastreabilidade; não apagar seu conteúdo do banco sem plano de preservação e autorização específica. Avaliar retirada do estado publicado e dependências em uma futura implementação.

## Sequência futura e riscos a validar

Antes de implementar, obter dados por URL/query de intervalo comparável e, quando possível, backlinks externos/links do Search Console. Verificar especialmente intenção comportamental de A; se ela trouxer demanda distinta relevante, reconsiderar reposicionamento. Ausência desses dados não prova ausência de valor orgânico. Congelar snapshot novo e apresentar texto consolidado revisável a Weverlyn; aprovação do Lote 1 não equivale a aprovação de um guia consolidado que ainda não foi redigido.

Após aprovação e autorização futuras: publicar a revisão em B, tirar A das coleções publicadas preservando arquivo, ativar o 301 e regenerar os caches hospedados na mesma janela controlada. Testar status 301/200, destino e conteúdo, datas/schema, sitemap/feed/listagens, cinco grupos de cards e perfil. Uma action local não invalida automaticamente caches hospedados, conforme achado do Lote 1. Não declarar sincronização antes da verificação pública.

Registrar baseline de desempenho antes da execução e acompanhar cobertura e consultas depois; oscilações de ranking são possíveis e não têm prazo garantido. Manter o redirect em operação duradoura, monitorando acessos e erros; a orientação geral do [Google sobre mudanças de URL](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes) recomenda redirects permanentes e atualização das ligações. Um 301 não garante ganho de tráfego nem compensa um destino sem a resposta esperada.

Risco de perda de intenção: **moderado**, reduzido pela seção explícita sobre motivação/ambiente. Proximidade semântica para 301: **alta**, desde que essa seção esteja incorporada. Melhor manter dois? Apenas se houver decisão de criar contribuição comportamental própria e dados/contexto que a justifiquem; no conteúdo atual, a opção preferida é consolidar A em B.

**Nada deste plano foi implementado. Nenhum artigo, link, redirect, banco, schema, sitemap ou feed alterado; nenhum commit, push ou deploy.**
