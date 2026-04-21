# Especificação de Feature: Frontend de Board Estilo Trello

**Branch da Feature**: `001-trello-board-frontend`  
**Criado em**: 2026-04-20  
**Status**: Rascunho  
**Entrada**: Descrição do usuário: "Frontend para um sistema de board pessoal estilo Trello"

## Cenários de Uso e Testes *(obrigatório)*

### História de Usuário 1 — Gerenciar Boards (Prioridade: P1)

Como usuário, posso ver todos os meus boards na tela inicial e criar ou excluir boards, para ter sempre uma visão geral dos meus projetos em andamento.

**Por que essa prioridade**: Boards são o container de nível mais alto para todo o trabalho. Sem gerenciamento de boards, nenhuma outra funcionalidade é acessível.

**Teste Independente**: Pode ser testado completamente abrindo a tela inicial, criando um novo board pelo formulário inline e confirmando que ele aparece como um card clicável. Entrega valor isolado como uma simples lista de projetos.

**Cenários de Aceite**:

1. **Dado** que a tela inicial está aberta, **Quando** a página carrega, **Então** todos os boards existentes são exibidos como cards clicáveis.
2. **Dado** que a tela inicial está aberta, **Quando** o usuário preenche o nome do board e envia o formulário inline, **Então** um novo card de board aparece na lista.
3. **Dado** que um card de board está visível, **Quando** o usuário clica no botão excluir e confirma, **Então** o board é removido da lista.
4. **Dado** que um card de board está visível, **Quando** o usuário clica no card (não no botão excluir), **Então** o usuário é levado para a tela de detalhes do board.

---

### História de Usuário 2 — Gerenciar Colunas e Cards Dentro de um Board (Prioridade: P2)

Como usuário, posso abrir um board e ver suas colunas lado a lado, adicionar novas colunas, adicionar cards dentro das colunas e excluir colunas e cards, para organizar tarefas visualmente.

**Por que essa prioridade**: Colunas e cards são a unidade principal de organização. Esta história entrega o canvas principal do board e viabiliza o gerenciamento de tarefas.

**Teste Independente**: Pode ser testado navegando para um board, adicionando duas colunas, adicionando cards em cada uma e excluindo um card e uma coluna. Entrega um board Kanban funcional.

**Cenários de Aceite**:

1. **Dado** que um board está aberto, **Quando** a página carrega, **Então** todas as colunas são exibidas lado a lado com rolagem horizontal, e cada coluna mostra seus cards em ordem.
2. **Dado** que um board está aberto, **Quando** o usuário digita um nome de coluna no formulário inline e envia, **Então** uma nova coluna vazia aparece no final.
3. **Dado** que uma coluna está visível, **Quando** o usuário digita um título de card no formulário inline da coluna e envia, **Então** um novo card aparece no final dessa coluna.
4. **Dado** que um card está visível, **Quando** o usuário clica no botão excluir do card, **Então** o card é removido da coluna.
5. **Dado** que uma coluna está visível, **Quando** o usuário clica no botão excluir da coluna, **Então** a coluna e todos os seus cards são removidos do board.

---

### História de Usuário 3 — Reordenar Cards e Colunas via Drag-and-Drop (Prioridade: P3)

Como usuário, posso arrastar cards entre colunas e dentro de uma coluna, e arrastar colunas para reordená-las, para reorganizar meu trabalho sem sair do board.

**Por que essa prioridade**: O drag-and-drop é a principal melhoria de UX em relação a listas simples. Depende do P2 (colunas/cards precisam existir primeiro).

**Teste Independente**: Pode ser testado arrastando um card de uma coluna para outra e atualizando a página para confirmar que a nova posição foi persistida. Também arrastar uma coluna para uma nova posição e atualizar.

**Cenários de Aceite**:

1. **Dado** que duas colunas têm cards, **Quando** o usuário arrasta um card de uma coluna e solta em outra, **Então** o card se move visualmente para a nova coluna imediatamente e a nova posição é salva no backend.
2. **Dado** que uma coluna tem múltiplos cards, **Quando** o usuário arrasta um card para uma nova posição dentro da mesma coluna, **Então** a ordem é atualizada imediatamente e a nova posição é salva.
3. **Dado** que um board tem múltiplas colunas, **Quando** o usuário arrasta uma coluna para uma nova posição, **Então** a ordem das colunas é atualizada imediatamente e a nova posição é salva.
4. **Dado** que um drag-and-drop foi concluído, **Quando** o usuário atualiza a página, **Então** o board reflete a ordem salva (posições persistidas no backend).

---

### Casos de Borda

- O que acontece quando o usuário tenta criar um board com nome vazio?
- O que acontece quando não há nenhum board — a tela inicial fica vazia ou exibe uma mensagem?
- O que acontece quando uma coluna não tem cards — a zona de drop continua visível e funcional?
- Como a interface lida com falha na requisição ao backend após um drag-and-drop (update otimista falhou)?
- O que acontece quando o usuário exclui a única coluna de um board?

## Requisitos *(obrigatório)*

### Requisitos Funcionais

- **RF-001**: O sistema DEVE exibir todos os boards na tela inicial como cards clicáveis.
- **RF-002**: O sistema DEVE permitir que o usuário crie um novo board via formulário inline (campo nome + botão enviar) na tela inicial.
- **RF-003**: O sistema DEVE permitir que o usuário exclua um board com uma etapa simples de confirmação.
- **RF-004**: O sistema DEVE navegar para a tela de detalhes do board quando um card de board for clicado.
- **RF-005**: O sistema DEVE exibir todas as colunas do board selecionado lado a lado com rolagem horizontal.
- **RF-006**: O sistema DEVE exibir os cards de cada coluna ordenados pelo campo `position` em ordem crescente.
- **RF-007**: O sistema DEVE permitir que o usuário adicione uma nova coluna ao board via formulário inline (campo nome).
- **RF-008**: O sistema DEVE permitir que o usuário adicione um novo card a qualquer coluna via formulário inline (campo título) dentro dessa coluna.
- **RF-009**: O sistema DEVE permitir que o usuário exclua qualquer card com uma ação de exclusão visível.
- **RF-010**: O sistema DEVE permitir que o usuário exclua qualquer coluna com uma ação de exclusão visível.
- **RF-011**: O sistema DEVE suportar arrastar um card de uma coluna para outra, refletindo imediatamente a mudança na interface e persistindo a nova coluna e posição no backend.
- **RF-012**: O sistema DEVE suportar arrastar um card dentro da mesma coluna para reordená-lo, atualizando imediatamente a interface e persistindo a nova posição.
- **RF-013**: O sistema DEVE suportar arrastar colunas para reordená-las dentro do board, atualizando imediatamente a interface e persistindo a nova posição.
- **RF-014**: O sistema DEVE exibir o nome do board no topo da tela de detalhes.
- **RF-015**: O sistema DEVE consumir a API REST do backend em `http://localhost:8080` sem autenticação.

### Entidades Principais

- **Board**: Container nomeado para colunas; identificado por ID numérico; possui timestamp de criação.
- **Coluna**: Lista ordenada dentro de um board; possui nome e posição numérica; pertence a exatamente um board; contém zero ou mais cards.
- **Card**: Item de tarefa dentro de uma coluna; possui título, descrição opcional, label opcional, posição numérica e flag de conclusão; pertence a exatamente uma coluna.

## Critérios de Sucesso *(obrigatório)*

### Resultados Mensuráveis

- **CS-001**: Um usuário consegue criar um board, adicionar duas colunas, adicionar um card em cada coluna e arrastar um card para a outra coluna — tudo em menos de 60 segundos após abrir o app.
- **CS-002**: Após qualquer ação de drag-and-drop, a nova ordem é visível na tela em menos de 200 milissegundos (update otimista) e confirmada no backend em até 2 segundos.
- **CS-003**: Atualizar a página após qualquer ação de criação, exclusão ou reordenação reflete o estado correto — todas as mudanças persistem.
- **CS-004**: Todos os cenários de aceite definidos nas Histórias de Usuário passam sem erros em um navegador apontando para `http://localhost:4200` com o backend rodando em `http://localhost:8080`.
- **CS-005**: Nenhum erro de CORS aparece no console do navegador durante o uso normal.

## Premissas

- O backend em `http://localhost:8080` já está rodando e totalmente funcional; esta especificação cobre apenas o frontend.
- Nenhuma autenticação é necessária; o sistema é monousuário e pessoal.
- O backend já habilita CORS para `http://localhost:4200`.
- Responsividade mobile está fora do escopo da v1; o app é projetado para navegadores desktop.
- Edição inline do título de um card já criado está fora do escopo da v1.
- Modal de detalhes do card (descrição, label) está fora do escopo da v1.
- Modo escuro está fora do escopo da v1.
- Quando um drag-and-drop falha no backend, o frontend pode manter o estado otimista na interface (sem rollback automático na v1).
- Os valores de posição são inteiros com base 1 (primeiro item = 1).
- O backend retorna colunas com cards embutidos ao buscar as colunas de um board.
