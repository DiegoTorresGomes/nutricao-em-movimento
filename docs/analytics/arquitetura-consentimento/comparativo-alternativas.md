# Comparativo de alternativas

## Alternativas avaliadas

- **A1, alvo:** a CMP do Google cuida da publicidade e o banner próprio cuida das estatísticas, com o propósito de análise **desativado** no painel.
- **A2, transição:** igual a A1, mas com o painel **inalterado** (análise ativa). Regra restritiva: estatísticas exigem o "sim" do site, e uma recusa do Google prevalece.
- **B, CMP única:** uma CMP certificada de terceiros (TCF) coordena publicidade e estatísticas para todas as regiões, no lugar da mensagem do Google.
- **C, situação atual:** a mensuração continua condicionada à CMP do Google; F2 e F3 sozinhas.

Uma variante foi considerada e **descartada**: banner próprio só quando a CMP do Google estiver ausente após um tempo de espera. Ela depende de inferir aplicabilidade por timeout, o que foi vetado.

## Quadro comparativo

| Critério | A1 | A2 | B | C |
|---|---|---|---|---|
| Conformidade e riscos | Boa, se validada juridicamente. Uma autoridade por finalidade | Segura (sem concessão implícita, recusa prevalece); duas perguntas sobre estatísticas no EEE | Potencialmente a melhor (um registro, TCF para tudo), mas depende do fornecedor e da configuração | Mais conservadora: nada é coletado no Brasil |
| Viabilidade técnica | Comprovada no protótipo (D-OFF, E, F-OFF, H-OFF, I a O) | Comprovada (D-ON, F-ON, H-ON) | Exige integração nova, remover ou desativar a mensagem do Google e reconfigurar o AdSense | Já implementada (F2/F3, 16/16) |
| Experiência do usuário | Brasil: um banner. EEE: duas mensagens em sequência, sem sobreposição de finalidade | EEE: duas mensagens, com estatísticas perguntadas duas vezes | Uma interface para todos | Sem banner no Brasil, rodapé "Aguardando" |
| Controle sobre os dados | Alto para estatísticas (decisão própria, versionada) | Igual a A1 | Delegado ao fornecedor | Delegado ao Google, que não decide no Brasil |
| Confiabilidade da mensuração | Mede quem aceita, no Brasil e no EEE | Igual a A1, com menos aceites no EEE | Mede quem aceita, em todas as regiões | Aproximadamente zero de usuários novos no Brasil |
| Manutenção | Baixa: código pequeno e já conhecido | Baixa | Média a alta: fornecedor, TCF, atualizações | Mínima |
| Dependência de terceiros | Google só para publicidade | Google também para estatísticas no EEE | Fornecedor da CMP | Total, do Google |
| Compatibilidade com AdSense | Preservada: tag e `ad_*` intocados | Preservada | Exige revalidar a CMP certificada e a integração; arriscado durante a revisão | Preservada |
| Custo | Nenhum direto (eventual custo jurídico) | Nenhum direto | Assinatura da CMP mais integração | Nenhum, mas sem dados |
| Esforço | Pequeno: cerca de 6 arquivos, testes e políticas, mais uma mudança no painel | Pequeno: o mesmo código, sem painel | Alto | Nenhum |

## Recomendação

**Fazer A2 e depois A1, com o mesmo código.**
1. **Agora (A2):** implementar o código da Alternativa A depois das condições jurídicas e de política. Ele funciona com o painel atual, resolve a mensuração no Brasil e não exige mudar o AdSense durante a revisão.
2. **Depois (A1):** desativar o propósito de análise no painel, com aprovação explícita. A pergunta duplicada no EEE desaparece, sem mudar o código.

Justificativa baseada nas evidências:
- A1 e A2 passaram nos mesmos 21 cenários. Em nenhum deles houve concessão implícita ou coleta antes do "sim" (matriz).
- A documentação admite banner próprio para Analytics e restringe a exigência de CMP certificada aos anúncios personalizados.
- B resolveria a experiência única, mas troca a CMP justamente durante a revisão do AdSense, tem custo e exige revalidação. Fica como evolução se o público europeu crescer.
- C mantém a mensuração do público principal perto de zero.
