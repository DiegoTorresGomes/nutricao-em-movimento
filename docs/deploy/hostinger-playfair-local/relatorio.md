# Hostinger — Playfair Display local

08/11/2026. **BUILD LOCAL: PASS. HOSTINGER: PENDENTE DE NOVO DEPLOY.** Nenhum commit, push ou deploy foi executado.

## Diagnóstico e escopo

O diagnóstico fornecido identifica a falha de `next build` no loader Google da Playfair Display em Next 15.5.29: o resultado de uma regex que extrai a extensão é `null`, mas o loader acessa `[1]`. O log remoto não identifica a URL problemática. Não há evidência suficiente para atribuir a falha à rede da Hostinger, nem aos pesos válidos 500, 600 e 700. Não foi realizada nova operação na conta Hostinger.

Somente a Playfair foi migrada. O único arquivo funcional existente alterado é `src/app/layout.tsx`: import de `Playfair_Display` removido, `Lato` mantido e `localFont` adicionado. A declaração de Lato foi comparada literalmente com `HEAD` e permanece idêntica.

## Arquivo e configuração

Novo arquivo: `src/app/fonts/PlayfairDisplay-Variable.woff2`, fonte verdadeira obtida diretamente da distribuição Google Fonts, versão de URL v40, bloco Latin. Família interna Playfair Display; eixo `wght` 400–900; normal. O arquivo permanece original, sem conversão. Origem, tamanho e hash em [fonte-validacao.json](fonte-validacao.json) e no README junto à fonte.

Licença SIL OFL 1.1, com aviso de copyright e Reserved Font Name, incluída integralmente em `src/app/fonts/OFL-PlayfairDisplay.txt`, obtida do repositório oficial [google/fonts](https://github.com/google/fonts/tree/main/ofl/playfairdisplay). Não foi criada ou substituída a família por outra fonte.

```tsx
const playfair = localFont({
  src: "./fonts/PlayfairDisplay-Variable.woff2",
  variable: "--font-playfair",
  weight: "500 700",
  style: "normal",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});
```

`subsets` removido somente da Playfair. `playfair.variable` no body permanece. `globals.css` continua usando `--font-playfair` em h1–h4 com Georgia/serif como fallback. O tipo instalado aceita `Times New Roman` para ajuste de fallback. Não foram alterados tamanhos, line-height, espaçamento, cores, classes ou componentes de títulos.

A busca de uso encontrou a importação e declaração apenas no layout, a variável no body e a regra de h1–h4 em globals.css. Os pesos explícitos anteriores eram 500/600/700; headings usam predominantemente `font-semibold` (600) e `font-bold` (700), com ocorrências de `font-medium` (500) no projeto. Classes normal/black também existem para outros elementos; não foi ampliada a configuração da Playfair para mudar o desenho atual.

## Verificações concluídas

- **Lint: PASS**, com dois avisos preexistentes: `<img>` em segurança e import não utilizado em AdminLayout.
- **Typecheck: PASS**, `npx tsc --noEmit`.
- **Build: PASS**, `npm run build` incluindo Prisma generate e compilação de produção.
- Artefato WOFF2 emitido: `e399f3e068a97f0c-s.p.woff2`, idêntico byte a byte ao arquivo local. CSS tem `font-weight:500 700`, `font-display:swap` e `--font-playfair`; nenhuma URL externa da Playfair nesse CSS. Import Google da Playfair removido. Evidência em [artefato-validacao.json](artefato-validacao.json).
- GET local de home, listagem, artigo individual e perfil da autora: todos 200 e com stylesheet que referencia a fonte local; recurso WOFF2 200 e conteúdo idêntico ao original. Não se presumiu preload no HTML. Nenhum JavaScript de artigo foi executado. Evidência em [http-local.json](http-local.json).
- Cmap lido com fontkit já incluído no Next: nenhum glifo ausente em `á é í ó ú ã õ ç`, maiúsculas e outros acentos portugueses, nem em “Nutrição”, “Alimentação”, “Saúde”, “Emagrecimento” e “Weverlyn da Cruz Alves Torres”. O eixo cobre 500, 600 e 700. Isso comprova cobertura do arquivo, não a fonte efetivamente pintada em um navegador.
- Comparação com o WOFF2 Latin do build anterior: família, métricas e contornos/avanços dos glifos dos textos de amostra coincidem na instância padrão. Evidência em [comparacao-fonte.json](comparacao-fonte.json). Os binários têm hashes diferentes; não se afirma comparação visual de todas as instâncias variáveis.

O primeiro build encontrou `EINVAL/readlink` no cache `.next` do OneDrive. Esse artefato foi preservado em `node_modules/.cache/playfair-build-*` após conferir os caminhos absolutos; a reconstrução limpa passou. Nenhum fonte foi apagado. `.next/` continua ignorado pelo Git. Essa falha local não foi usada como explicação do erro remoto.

O diretório solicitado `node_modules/next/dist/docs/` não existe nesta instalação. Foram consultados os tipos e loader efetivamente instalados e a [documentação oficial de fontes do Next 15](https://nextjs.org/docs/15/app/api-reference/components/font) antes da edição.

## Revisão visual e pendências

**Revisão visual desktop/mobile: PENDENTE.** O inventário do controle de computador retornou “The browser access host is unavailable”. Não houve renderização visual, inspeção de fonte computada, screenshot comparativo ou alegação de equivalência visual confirmada. As verificações de arquivo, métricas e HTTP não substituem essa inspeção.

Após disponibilizar o navegador, conferir home, listagem, artigo e perfil em desktop/mobile: títulos, headings, larguras, peso, quebras de linha e os textos acentuados acima. Confirmar fonte local em uso, sem glifos ausentes ou fallback inesperado.

**Hostinger continua pendente de novo deploy expressamente autorizado.** O sucesso local não comprova o próximo build remoto.

## Preservação

Conteúdo editorial, banco, newsletter, sitemap/feed, Lato e CSS não foram alterados. Não foram executadas migrations ou escritas no banco. Não houve commit, push ou deploy. Além do layout, foram adicionados somente a fonte, sua licença/README e esta pasta de documentação/evidências.
