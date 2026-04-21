# Tarefas: Frontend de Board Estilo Trello

**Entrada**: Documentos de design em `/specs/001-trello-board-frontend/`
**Pré-requisitos**: plan.md, spec.md, research.md, data-model.md, contracts/api-contracts.md

**Testes**: Não solicitados — nenhuma tarefa de teste incluída.

**Organização**: Tarefas agrupadas por história de usuário para permitir implementação e teste independentes de cada história.

## Formato: `[ID] [P?] [História] Descrição`

- **[P]**: Pode ser executado em paralelo (arquivos diferentes, sem dependências)
- **[História]**: A qual história de usuário a tarefa pertence (US1, US2, US3)

---

## Fase 1: Configuração (Infraestrutura Compartilhada)

**Objetivo**: Montar o scaffold da aplicação Angular 17 standalone e instalar dependências compartilhadas

- [x] T001 Criar scaffold do app Angular 17 standalone na raiz do repositório com `ng new board-frontend --standalone --routing --style=css --skip-tests` (ou verificar scaffold Angular existente)
- [x] T002 Instalar o pacote drag-drop `@angular/cdk@17`: `npm install @angular/cdk@17`
- [x] T003 Criar `src/environments/environment.ts` com `apiUrl: 'http://localhost:8080'`
- [x] T004 [P] Configurar `src/app/app.config.ts` com os providers `provideRouter(routes)` e `provideHttpClient()`
- [x] T005 [P] Configurar `src/app/app.routes.ts` com rota `''` → HomeComponent e `'board/:id'` → BoardComponent
- [x] T006 Substituir o shell de `src/app/app.component.ts` por um componente standalone mínimo importando `RouterOutlet`, e atualizar `src/app/app.component.html` para conter apenas `<router-outlet />`

---

## Fase 2: Fundação (Pré-requisitos Bloqueantes)

**Objetivo**: Interfaces de modelo TypeScript — necessárias por todos os serviços e componentes

**⚠️ CRÍTICO**: Nenhuma história de usuário pode começar até que esta fase esteja completa

- [x] T007 [P] Criar `src/app/models/board.model.ts` com a interface `Board` (`id`, `name`, `createdAt`)
- [x] T008 [P] Criar `src/app/models/column.model.ts` com a interface `Column` (`id`, `boardId`, `name`, `position`, `cards: Card[]`)
- [x] T009 [P] Criar `src/app/models/card.model.ts` com a interface `Card` (`id`, `columnId`, `title`, `description?`, `label?`, `position`, `completed`, `createdAt`)

**Checkpoint**: Modelos criados — implementação das histórias de usuário pode começar

---

## Fase 3: História de Usuário 1 — Gerenciar Boards (Prioridade: P1) 🎯 MVP

**Objetivo**: Tela inicial listando todos os boards com criação e exclusão. Clicar em um board navega para `/board/:id`.

**Teste Independente**: Abrir `http://localhost:4200`, confirmar que a lista de boards carrega, criar um novo board, confirmar que aparece, excluí-lo, confirmar que desaparece, clicar em um card de board restante e confirmar navegação para `/board/:id`.

### Implementação da História de Usuário 1

- [x] T010 [US1] Criar `src/app/services/board.service.ts` como serviço standalone injetável usando `HttpClient` com os métodos: `getBoards(): Observable<Board[]>`, `createBoard(name: string): Observable<Board>`, `deleteBoard(id: number): Observable<void>` — todos usando `environment.apiUrl`
- [x] T011 [US1] Criar `src/app/pages/home/home.component.ts` como componente standalone que injeta `BoardService` e `Router`, carrega boards no `ngOnInit`, expõe métodos `createBoard(name)` e `deleteBoard(board)` (com diálogo `confirm()`) e controla estado do formulário inline (`showAddForm`, `newBoardName`)
- [x] T012 [US1] Criar `src/app/pages/home/home.component.html` com: grid de cards de boards (cada card clicável, roteando para `/board/:id`), formulário inline de criação de board (input de texto + botão enviar, exibido via toggle `showAddForm`) e botão excluir em cada card
- [x] T013 [US1] Aplicar CSS em `src/app/pages/home/home.component.html` (ou arquivo `.css` co-localizado) para o layout da home: padding da página, grid de cards (`display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))`), estado hover do card e estilização do formulário inline

**Checkpoint**: História de Usuário 1 completa — tela inicial totalmente funcional

---

## Fase 4: História de Usuário 2 — Gerenciar Colunas e Cards (Prioridade: P2)

**Objetivo**: Tela de board mostrando colunas lado a lado com rolagem horizontal. Adicionar/excluir colunas e cards via formulários inline.

**Teste Independente**: Navegar para `/board/1` (com board populado), confirmar que as colunas aparecem lado a lado, adicionar uma coluna, adicionar um card nela, excluir o card, excluir a coluna.

### Implementação da História de Usuário 2

- [x] T014 [P] [US2] Criar `src/app/services/column.service.ts` como injetável com `HttpClient` e os métodos: `getColumns(boardId: number): Observable<Column[]>`, `createColumn(boardId: number, name: string): Observable<Column>`, `updateColumn(id: number, patch: Partial<Column>): Observable<Column>`, `deleteColumn(id: number): Observable<void>`
- [x] T015 [P] [US2] Criar `src/app/services/card.service.ts` como injetável com `HttpClient` e os métodos: `createCard(columnId: number, title: string): Observable<Card>`, `updateCard(id: number, patch: Partial<Card>): Observable<Card>`, `deleteCard(id: number): Observable<void>`
- [x] T016 [US2] Criar `src/app/pages/board/board.component.ts` como componente standalone que lê `:id` do `ActivatedRoute`, carrega colunas (com cards embutidos ordenados por `position`) via `ColumnService` no init, e expõe os métodos: `addColumn(name)`, `deleteColumn(col)`, `addCard(col, title)`, `deleteCard(col, card)` — todos realizando mutações otimistas no array local seguidas de chamadas à API
- [x] T017 [US2] Criar `src/app/pages/board/board.component.html` com: cabeçalho com nome do board, container de colunas com rolagem horizontal, cada coluna exibindo nome + lista de cards + formulário inline de adicionar card + botão excluir coluna, e formulário global inline de adicionar coluna
- [x] T018 [US2] Aplicar CSS em `src/app/pages/board/board.component.html` (ou `.css` co-localizado) para o layout do board: canvas full-height (`height: calc(100vh - cabeçalho)`), faixa de colunas (`display: flex; overflow-x: auto; align-items: flex-start; gap: 12px; padding: 16px`), caixa da coluna (`min-width: 280px; max-width: 280px; background: #ebecf0; border-radius: 3px`), item de card (`background: #fff; border-radius: 3px; padding: 8px; margin-bottom: 4px`) e altura mínima da coluna vazia para que a zona de drop continue visível

**Checkpoint**: História de Usuário 2 completa — gerenciamento completo do board sem drag-drop

---

## Fase 5: História de Usuário 3 — Reordenação via Drag-and-Drop (Prioridade: P3)

**Objetivo**: Arrastar cards entre e dentro de colunas; arrastar colunas para reordenar. Cada drop persiste a posição no backend.

**Teste Independente**: Arrastar um card da coluna A para a coluna B, atualizar — card está na coluna B. Arrastar um card para uma posição diferente dentro da coluna, atualizar — ordem preservada. Arrastar uma coluna para nova posição, atualizar — ordem das colunas preservada.

### Implementação da História de Usuário 3

- [x] T019 [US3] Adicionar `DragDropModule` (ou diretivas CDK individuais: `CdkDrag`, `CdkDropList`, `CdkDropListGroup`) ao array `imports` de `src/app/pages/board/board.component.ts`
- [x] T020 [US3] Atualizar `src/app/pages/board/board.component.html` para adicionar `cdkDropListGroup` no container de colunas, `cdkDropList [cdkDropListData]="col.cards" (cdkDropListDropped)="onCardDrop($event)"` na lista de cards de cada coluna e `cdkDrag` em cada item de card
- [x] T021 [US3] Implementar `onCardDrop(event: CdkDragDrop<Card[]>)` em `src/app/pages/board/board.component.ts`: chamar `transferArrayItem` ou `moveItemInArray`, calcular `newPosition = event.currentIndex + 1`, chamar `CardService.updateCard(card.id, { position: newPosition, columnId? })` — fazer patch de `columnId` apenas em drops entre colunas
- [x] T022 [US3] Adicionar drag-drop de colunas em `src/app/pages/board/board.component.html`: envolver toda a faixa de colunas em `cdkDropList cdkDropListOrientation="horizontal" (cdkDropListDropped)="onColumnDrop($event)"` e adicionar `cdkDrag` em cada wrapper de coluna (com `cdkDragHandle` no cabeçalho da coluna para evitar conflitos com o drag de cards)
- [x] T023 [US3] Implementar `onColumnDrop(event: CdkDragDrop<Column[]>)` em `src/app/pages/board/board.component.ts`: chamar `moveItemInArray(this.columns, ...)`, calcular `newPosition = event.currentIndex + 1`, chamar `ColumnService.updateColumn(col.id, { position: newPosition })`
- [x] T024 [US3] Adicionar CSS de drag-drop do CDK: importar `@angular/cdk/drag-drop/drag-drop.css` (ou equivalente) e adicionar sobrescritas de `.cdk-drag-placeholder` e `.cdk-drag-animating` para que o ghost de drag e o placeholder de drop correspondam ao estilo dos cards/colunas

**Checkpoint**: Todas as três histórias de usuário completas e funcionando independentemente

---

## Fase 6: Polimento e Aspectos Transversais

**Objetivo**: Polimento de UX e estilos globais que abrangem múltiplas histórias

- [x] T025 [P] Adicionar reset CSS global e estilos base em `src/styles.css`: box-sizing border-box, margin 0 no body, font-family, cor de fundo do canvas do board
- [x] T026 [P] Adicionar uma barra de navegação superior mínima em `src/app/app.component.html` com título do app e link "Home" usando `routerLink="/"`
- [x] T027 Adicionar feedback básico de carregamento e estado vazio em `home.component.html` (ex.: "Nenhum board ainda — crie um!") e `board.component.html` (ex.: "Nenhuma coluna ainda — adicione uma!")

---

## Dependências e Ordem de Execução

### Dependências entre Fases

- **Configuração (Fase 1)**: Sem dependências — pode começar imediatamente
- **Fundação (Fase 2)**: Depende da conclusão da Fase 1 — **BLOQUEIA todas as histórias de usuário**
- **US1 (Fase 3)**: Depende da Fase 2 — sem dependência de US2/US3
- **US2 (Fase 4)**: Depende da Fase 2 — sem dependência de US1 (roteia independentemente para `/board/:id`)
- **US3 (Fase 5)**: Depende da Fase 4 (o componente board precisa existir primeiro)
- **Polimento (Fase 6)**: Depende da conclusão de todas as histórias desejadas

### Dependências entre Histórias de Usuário

- **História de Usuário 1 (P1)**: Após Fundação — totalmente independente
- **História de Usuário 2 (P2)**: Após Fundação — totalmente independente de US1
- **História de Usuário 3 (P3)**: Após US2 — estende o componente board

### Dentro de Cada História de Usuário

- Modelos antes dos serviços (Fase 2 antes das Fases 3+)
- Serviços antes do componente (T010 antes de T011/T012)
- Componente TS antes do template (T016 antes de T017)
- Template antes do CSS (T017 antes de T018)

### Oportunidades de Paralelismo

- T007, T008, T009 (todos os modelos) — totalmente paralelos
- T014, T015 (serviços de coluna + card) — totalmente paralelos
- T004, T005 (app.config, app.routes) — totalmente paralelos
- T025, T026 (tarefas de polimento) — totalmente paralelos

---

## Exemplos de Paralelismo

### Fase 2 (Modelos)
```
Executar em paralelo:
  T007 — board.model.ts
  T008 — column.model.ts
  T009 — card.model.ts
```

### Fase 4 (Serviços)
```
Executar em paralelo:
  T014 — column.service.ts
  T015 — card.service.ts
```

---

## Estratégia de Implementação

### MVP Primeiro (Somente História de Usuário 1)

1. Completar Fase 1: Configuração
2. Completar Fase 2: Modelos de fundação
3. Completar Fase 3: História de Usuário 1 (tela inicial)
4. **PARAR e VALIDAR**: Lista de boards, criar, excluir, navegar — tudo funcionando
5. Deploy / demonstração

### Entrega Incremental

1. Configuração + Fundação → scaffold pronto
2. US1 → tela inicial funcionando (MVP)
3. US2 → board com colunas e cards funcionando
4. US3 → experiência completa de drag-and-drop
5. Polimento → visual pronto para produção

---

## Observações

- Tarefas com [P] escrevem em arquivos diferentes — sem conflitos ao executar em paralelo
- Labels [História] rastreiam cada tarefa até os critérios de aceite na spec.md
- Tarefas de CSS fazem parte de cada fase de história, não são adiadas — cada história deve ter boa aparência quando concluída
- Nenhum teste incluído (não solicitado na spec); adicionar com `/speckit.tasks --tdd` se desejado depois
- O Angular CDK requer `provideAnimations()` em `app.config.ts` se animações de drag forem desejadas (T004 pode ser atualizado)
