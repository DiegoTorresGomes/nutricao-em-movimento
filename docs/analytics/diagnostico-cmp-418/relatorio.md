# Diagnóstico final: CMP publicada, API ausente e erro React #418

Data: 2026-11-20. Somente investigação, sem nenhuma alteração de código funcional, banco, AdSense, GA4 ou consentimentos. Sem commit, push ou deploy.

## Como os testes foram feitos

- **Ambiente:** produção (`https://www.nutricaoemovimento.com`) acessada com Chrome headless.
- **Coleta do GA4:** `/g/collect` respondido localmente com 204, para não contaminar os dados.
- **Anúncios:** toda requisição real de anúncio (`pagead/ads`, `doubleclick.net/pagead/ads`) foi bloqueada, para não gerar impressões automatizadas.
- **Página sintética:** a mesma origem serviu, via interceptação, uma página com apenas os defaults de consentimento e o tag AdSense. Ela isola o código do site.
- **Scripts e resultados brutos:** estão em `evidencias/`.

## 1. Causas

### 1.1 CMP: o comportamento é esperado para visitantes fora do EEE, Reino Unido e Suíça

| Sintoma relatado | Explicação comprovada |
|---|---|
| `window.googlefc` existe | Quem cria o objeto é o próprio site (`startGoogleCmp`, em produção). Nele há só a chave `callbackQueue`. Na página sintética, sem o código do site, `googlefc` é `null`. |
| `__tcfapi` e `getGoogleConsentModeValues` indefinidos | O script da CMP (`fundingchoicesmessages.google.com`) nunca é inserido. Não há iframe `googlefcPresent` nem `__tcfapiLocator`. |
| A mensagem não aparece nem com `?fc=alwaysshow&fctype=gdpr` | No código da AdSense (`show_ads_impl.js`, versão m202611110101), `fc` e `fctype` só são lidos em `ZE()`. `ZE()` monta a URL da CMP depois que a AdSense já decidiu carregá-la, então o parâmetro não força o carregamento. |

Por que a AdSense não carrega a CMP:

- **A decisão vem do servidor do Google.** O `adsbygoogle.js?client=…` traz um estado de página embutido. O campo 26 desse estado vira `OSCLM.UWEfJ`, que a própria AdSense registra na telemetria como `isGdprCountry`.
- **O valor recebido daqui:** neste acesso, servido como `.google.com.br`, o campo 26 é `[0,0,0]`, ou seja, `isGdprCountry=false`.
- **A condição de carregamento:** o carregador automático (`dda` → `cE` → `dF.start`) exige `ZC(config) && (Va || j)`, em que `Va = isGdprCountry` e `j` é o campo 20, ausente aqui. Com `Va=false`, a CMP não é carregada.
- **O que a documentação pública confirma:**
  - A mensagem de Regulamentações europeias se destina ao EEE, Reino Unido e Suíça.
  - Segundo a ajuda da AdSense, a CMP do Google "só atualiza as escolhas de usuários que veem a mensagem; defaults para outras regiões precisam de configuração separada".

**Conclusão:** a mensagem está publicada, como o painel mostra, mas o Google não a entrega a visitantes classificados como fora do EEE, Reino Unido e Suíça. Para o público brasileiro, a ausência de `__tcfapi` é o funcionamento normal, não uma falha de inicialização.

**Limites da evidência:**
- **Código não documentado:** a leitura é de código minificado e sem contrato público. Ela explica o comportamento observado, mas pode mudar a qualquer versão.
- **Configuração não observada:** a configuração de Auto Ads (`tYcft`) chega de forma assíncrona e não pôde ser observada. As requisições de anúncio foram bloqueadas de propósito.
- **Sem teste no EEE:** não houve teste com saída de rede no EEE, então o carregamento da CMP para visitantes europeus não foi observado diretamente.

### 1.2 React #418: causa comprovada

O `adsbygoogle.js` insere `<script async src=…/show_ads_impl.js>` com `firstScript.parentNode.insertBefore(...)`, isto é, antes do primeiro `<script>` do documento. Esse ponto fica dentro do `<head>` gerado pelo React. Quando isso acontece antes da hidratação, o React encontra um nó a mais e falha com `#418?args[]=HTML`.

| Execução (/pt/sobre) | #418 |
|---|---|
| AdSense liberada, hidratação no tempo normal (cerca de 0,6s, antes da AdSense) | não |
| AdSense liberada, chunks do Next atrasados em 2,5s (AdSense roda antes; repetido 6 vezes) | **sim, todas** |
| `adsbygoogle.js` bloqueado, com ou sem atraso | não |
| AdSense liberada, removendo antes da hidratação apenas o `ins.adsbygoogle` | sim |
| Removendo apenas os 5 `meta` de origin trial | sim |
| Removendo apenas o `<script>` do `show_ads_impl` (repetido 2 vezes) | **não** |

O erro aparece em navegadores reais quando o `adsbygoogle.js` já está em cache ou a CPU é lenta: nesses casos a AdSense executa antes dos chunks do Next.

O que acontece na recuperação:
- **O que o React remove:** recria head e body no cliente e remove nós de terceiros, entre eles o `ins.adsbygoogle` (slot de Auto Ads) e o `iframe#google_esf`.
- **O que o React mantém:** os scripts e a folha de estilo.
- **CSS:** continua preservado em todas as execuções, com 1 stylesheet, header `sticky` e fonte Lato. A correção anterior segue válida.

Os múltiplos layouts raiz e o documento público não contribuem. Sem a AdSense, não ocorre #418, mesmo com hidratação atrasada.

### 1.3 Achado ambiental: não vem da produção

O Kaspersky instalado na máquina de teste intercepta HTTPS e injeta `gc.kis.v2.scr.kaspersky-labs.com/…/main.js` no `<head>` do HTML entregue ao Chrome. O `curl` recebe o HTML sem esse script. O script sozinho não causa #418 (execuções com a AdSense bloqueada). Antivírus desse tipo podem filtrar scripts de anúncio e de consentimento, então testes manuais feitos em máquinas com Kaspersky devem ser repetidos sem ele.

## 2. Evidências de rede (produção, `/pt?fc=alwaysshow&fctype=gdpr`)

- `adsbygoogle.js` 200 → `show_ads_impl.js` 200 → requisição de anúncio (bloqueada pelo teste) → `gen_204?id=adsense_fc_has_namespace_but_no_iframes` → `zrt_lookup` → sodar.
- Nenhuma requisição a `fundingchoicesmessages.google.com`. Nenhum erro de JavaScript, de CSP ou de rede além dos bloqueios do próprio teste.
- **CSP:** o único header é `Content-Security-Policy: upgrade-insecure-requests`. Ele não bloqueia nada.
- **Domínio:** origem efetiva `https://www.nutricaoemovimento.com`. A telemetria da AdSense reporta `su=www.nutricaoemovimento.com` e `wpc=ca-pub-3638053236344020`, sem divergência de domínio aparente.
- **Ping `adsense_fc_has_namespace_but_no_iframes`:** só aparece quando `googlefc` é criado antes da AdSense (produção e página sintética com o stub). Pelo código (`Dca`), é apenas telemetria e não bloqueia o carregamento. Criar o namespace é o que a própria documentação da API do Google orienta.

## 3. Relação entre #418 e a ausência da CMP

**Não há relação causal para o público brasileiro.** A CMP não é carregada por decisão do servidor do Google (`isGdprCountry=false`), com ou sem #418. A página sintética, sem React, também não carrega a CMP.

**Hipótese não comprovada para visitantes europeus:** se a CMP inserir os iframes `googlefcPresent` e `__tcfapiLocator` no body antes da hidratação, a recuperação do #418 os removeria, como removeu o `ins` e o `google_esf`. Para testar seria preciso navegação a partir do EEE.

## 4. Dá para corrigir só a inicialização da CMP?

Não há o que corrigir no código. Nenhuma API pública do Google informa ao site "a CMP não se aplica a este visitante" quando a AdSense decide não carregá-la. O valor interno `isGdprCountry` não é documentado e não deve ser usado. Também não usamos o tag de recuperação de bloqueadores.

## 5. Avaliação das correções F1, F2 e F3 (ainda não implantadas)

- **F2 (não apagar `_ga` sem recusa explícita) e F3 (uma única fonte de page_view):** corretas, testadas e independentes da CMP.
- **F1:** é segura, pois não infere consentimento, não cria duas autoridades e o rodapé fica acessível. Porém, para todo visitante fora do EEE, Reino Unido e Suíça ela termina em "indisponível" após 10s. Consequências:
  - **Estatísticas:** continuam desligadas para o público brasileiro, como já acontece hoje em produção (estado "pendente" eterno).
  - **Mensagem ao visitante:** o aviso "Controles de privacidade indisponíveis" seria exibido a todos os brasileiros que clicarem no rodapé. Ele é verdadeiro, mas induz a pensar em falha, quando na prática a CMP do Google simplesmente não se aplica.
- **Correção do relatório anterior:** o caminho de desbloqueio de `../correcao-ga4/relatorio.md` (publicar a mensagem → a CMP carrega → PASS) **não se sustenta**. A mensagem já está publicada e, mesmo assim, não é entregue no Brasil.

## 6. Riscos

- **Privacidade:**
  - Deploy de F1/F2/F3: risco baixo; nada é concedido sem escolha explícita.
  - Qualquer solução que libere estatísticas com base em geolocalização própria, idioma ou tempo de espera: risco alto (proibido pelo escopo).
- **Mensuração:**
  - Com ou sem o deploy, o GA4 continua sem medir visitantes novos do Brasil enquanto não houver uma autoridade de consentimento para eles.
  - Implantar agora não recupera os números e pode dar a impressão de que "o GA foi corrigido".
- **AdSense (#418):** em parte dos acessos, o slot de Auto Ads e o `google_esf` são removidos na recuperação, o que pode reduzir anúncios automáticos nessas visitas. O efeito sobre a CMP no EEE não foi verificado.

## 7. Menor intervenção justificável (para decisão, nada foi implementado)

1. **Decisão de política, sem código, necessária antes de qualquer deploy de GA4:** definir quem governa o consentimento de estatísticas fora do EEE, Reino Unido e Suíça. Opções documentáveis:
   - **(a) Banner local como autoridade quando a CMP do Google não for carregada.** Ele pede opt-in explícito, então não infere consentimento. Contrapartida: um visitante europeu cuja CMP falhe ou atrase veria o banner local. Isso hoje é vetado pela regra de "não aplicabilidade comprovada" e exige revisão dessa regra.
   - **(b) Verificar no painel Privacidade e mensagens se existe um tipo de mensagem de consentimento direcionável a outras regiões, incluindo o Brasil.** Se existir, a CMP do Google carregaria para brasileiros e devolveria estados reais, sem mudança de código. Não pude confirmar essa opção pela documentação.
   - **(c) Manter estatísticas desligadas fora do EEE** e aceitar a ausência de dados.
2. **#418, em mudança separada e opcional:** a correção mínima seria impedir que o `show_ads_impl` caia no `<head>` hidratado antes da hidratação, por exemplo carregando o `adsbygoogle.js` depois da hidratação e mantendo os 4 defaults inline primeiro. Isso altera o tag nativo validado e pode afetar a verificação ou revisão da AdSense. Só deve ser feito com essa avaliação, e não é pré-requisito do GA4.

## 8. Decisão

**FAIL para liberar o deploy do GA4.** O código não é inseguro. O motivo do bloqueio é a premissa de F1 ("a CMP do Google decide e confirma a não aplicabilidade"), que é falsa para o público principal. Implantar não recupera a mensuração e exibiria o aviso de indisponibilidade a todos os brasileiros. A liberação depende da decisão do item 7.1. Escolhida a opção:
- **(b), se existir:** a liberação pode ser feita sem alterar código.
- **(a):** F1 precisa de um ajuste pequeno, seguido de nova bateria de testes.

### Dados que ainda faltam

1. **Navegação a partir do EEE** (navegador real, sem antivírus que injete scripts): confirmar que a CMP carrega, que `getGoogleConsentModeValues` responde e se o #418 remove os iframes da CMP.
2. **`localStorage` no navegador do responsável, em produção:** valores de `google_ama_config` e `google_auto_fc_cmp_setting`, para confirmar a configuração de consentimento recebida.
3. **Painel:** confirmar se Privacidade e mensagens oferece mensagens direcionadas a outras regiões (opção 7.1-b).

## Fontes oficiais

- https://support.google.com/adsense/answer/10961068 (Sobre as mensagens de Regulamentações europeias)
- https://support.google.com/adsense/answer/16918505 (Como a CMP do Google funciona)
- https://support.google.com/adsense/answer/13554116 (Requisitos de consentimento no EEE, Reino Unido e Suíça)
- https://developers.google.com/funding-choices/fc-api-docs (API de Privacidade e mensagens)
