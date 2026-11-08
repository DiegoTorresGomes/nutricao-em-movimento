# Revisão humana das duas propostas pendentes

**Atualização após aplicação do Lote 2:** a aprovação visual humana de ambos os artigos nas cinco larguras foi informada expressamente pelo usuário. Foi registrada na aplicação transacional de 08/11/2026 às 19:37:59 UTC, sem inventar o horário histórico de inspeção. Os seis registros publicados passam no validador. Os resultados 4/6 e pendências abaixo descrevem a etapa de preparação, não o estado atual. Evidências finais: [relatório do Lote 2](../revisao-lote-2/relatorio.md), [integridade](../revisao-lote-2/integridade-final.json) e [aprovação recebida](../revisao-lote-2/aprovacao-visual-retomada.json). As prévias/manifesto e o JSON offline desta pasta permanecem como histórico da geração e do snapshot anterior; não substituem o resultado final.



Status: **PENDENTE**. Este documento e as prévias não registram aprovação nem escrevem no CMS/banco. “Comer por emoção é normal?” e “Alimentação Consciente: O Que É, Benefícios e Como Praticar o Mindful Eating” precisam de revisão real nos três dispositivos/grupos de revisão.

## Abrir as prévias sem banco

Na raiz do projeto, em PowerShell, com as dependências já instaladas:

```powershell
npm run build
node --import tsx scripts/prepare-editorial-preview.ts
node scripts/serve-editorial-preview.mjs
```

Abra `http://127.0.0.1:4182/` no Chrome ou Edge. O primeiro comando é o build normal da aplicação e pode executar suas leituras de pré-renderização; não aplica propostas. Se o build já estiver atualizado, execute apenas os dois últimos comandos. O gerador e o servidor de prévia usam somente arquivos locais; não carregam Prisma, actions, analytics ou contador de views. Não precisam de credenciais do banco.

O servidor atende apenas no computador local. Encerre com `Ctrl+C`. Se a porta estiver ocupada, encerre a instância anterior desta prévia antes de iniciar outra. Os arquivos gerados ficam em `docs/editorial/validacao-cms/previas/`, não em `.next/`; o CSS/fontes vêm do último build ignorado pelo Git. Após outro build, gere as prévias novamente para atualizar os nomes dos arquivos CSS.

## Conferir cada artigo em cinco larguras

1. Selecione o artigo no seletor. Os botões ajustam a largura do viewport do frame para **1440, 1023, 768, 375 e 320 px**, em pixels CSS. Mantenha o zoom do navegador em 100%. O frame tem rolagem própria; role até o final de cada artigo.
2. Alternativamente, abra `http://127.0.0.1:4182/comer-por-emocao.html` ou `http://127.0.0.1:4182/alimentacao-consciente.html`, pressione F12, ative a barra de dispositivos (`Ctrl+Shift+M`) e selecione modo responsivo, com cada largura e altura de aproximadamente 900 px. Esta opção também permite checar melhor a rolagem e o comportamento sticky da autora.
3. Em **cada uma das dez combinações artigo × largura**, confira todos os itens abaixo. Registre problemas e evidências; não considere a geração do HTML ou testes automatizados como revisão visual.

| Item | O que conferir |
| --- | --- |
| Título e resumo | Sem corte, sobreposição ou quebra que prejudique leitura; um H1 |
| Imagem principal | Carregamento, proporção, recorte e texto alternativo; não aprovar se a imagem não carregar |
| Corpo e largura de leitura | Texto confortável, sem colunas estreitas indevidas ou linhas cortadas |
| H2/H3, listas e negritos | Hierarquia, marcadores/numeração, contraste e espaçamento |
| Links | Identificação e clique; links abrem o site público em outra aba e não validam a proposta ainda inédita no destino |
| Referências | Todas presentes; títulos, URLs e DOIs longos legíveis e sem corte |
| Autora | Nome, CRN, foto e perfil; sidebar no desktop e posição após o corpo abaixo de 1024 px |
| CTA | Coerência do próximo passo aprovado; ausência de CTA comercial não é defeito por si só |
| Cards | Imagem, título, resumo e limites laterais; posição/ordem correspondem ao snapshot, não à seleção futura em produção |
| Overflow | Corte lateral, elementos fora da tela, URLs e cards largos, inclusive com rolagem horizontal ocultada pelo CSS |
| Tabelas | Os dois corpos aprovados não têm tabelas; marcar “não se aplica” após conferir, sem inserir tabela |
| Espaçamentos | Respiro entre seções, margem interna, cards e autora; confira toda a extensão da página |

**Atenção especial aos 320 px:** o componente público de card usa largura mínima de 300 px e a seção tem 16 px de padding de cada lado. Isso pode exceder os 288 px disponíveis. É uma condição a conferir visualmente, não um defeito corrigido ou aprovado nesta etapa. O CSS global usa `overflow-x: hidden`, por isso a falta de barra horizontal não comprova ausência de corte. No console do DevTools do frame, compare `document.documentElement.scrollWidth` com `innerWidth` e inspecione também os elementos e o resultado visual.

## Registro humano pendente

Preencha somente após abrir e revisar as propostas. Deixe a célula pendente se houver problema, imagem indisponível ou parte da revisão não executada.

| Proposta | 1440 px | 1023 px | 768 px | 375 px | 320 px |
| --- | --- | --- | --- | --- | --- |
| Comer por emoção | Pendente | Pendente | Pendente | Pendente | Pendente |
| Alimentação consciente | Pendente | Pendente | Pendente | Pendente | Pendente |

Responsável: **não registrado**. Data/hora: **não registrada**. Evidências e problemas: **a preencher pela pessoa revisora**.

Agrupamento sugerido para a conferência: desktop em 1440/1023 px; tablet em 1023/768 px; mobile em 375/320 px. Os três campos continuam independentes e só podem representar revisão humana concluída. Nenhum `desktopReviewed`, `tabletReviewed`, `mobileReviewed` ou `lastPreviewAt` foi alterado. Registrar revisão aqui não escreve esses campos. Nesta etapa, não salvar os artigos no CMS remoto nem executar o script de aplicação.

## Limites da prévia

São fixtures estáticas do miolo, com os corpos aprovados e a normalização pública de links, classes principais do template, CSS/fontes do build, capa do snapshot, autoria canônica e exemplos dos cards automáticos observados. Não incluem o cabeçalho/rodapé global, newsletter, consentimento, hidratação ou todos os detalhes dos componentes interativos. O botão Instagram é uma âncora simplificada. Capa e imagens de cards continuam remotas e exigem conexão; a foto da autora é servida da pasta `public/`.

Essas limitações impedem tratar a prévia como aprovação integral da página em produção. Se alguma parte omitida influenciar o layout, confirme-a em ambiente de desenvolvimento/staging com os mesmos textos e sem escrita no banco remoto, em etapa posterior autorizada. Nenhum dos dez cenários foi declarado revisado visualmente pelo Codex.
