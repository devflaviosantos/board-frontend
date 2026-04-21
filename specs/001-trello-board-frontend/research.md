# Pesquisa: Frontend de Board Estilo Trello

**Fase**: 0 — Pesquisa e Pontos em Aberto  
**Data**: 2026-04-20  
**Feature**: [spec.md](spec.md)

---

## Decisão 1: Componentes Standalone do Angular 17 (sem NgModules)

**Decisão**: Usar componentes standalone em todo o projeto (`standalone: true` em cada `@Component`). Bootstrap via `bootstrapApplication(AppComponent, appConfig)`.

**Justificativa**: O Angular 17 promove fortemente as APIs standalone; elas reduzem boilerplate, eliminam a necessidade de declarações em `NgModule` e estão alinhadas com a restrição do projeto. `provideRouter()` e `provideHttpClient()` substituem `RouterModule.forRoot()` e `HttpClientModule` no `app.config.ts`.

**Alternativas consideradas**: Arquitetura baseada em NgModule — rejeitada porque a especificação proíbe explicitamente, e adiciona cerimônia desnecessária para um app pessoal de pequeno porte.

---

## Decisão 2: @angular/cdk/drag-drop para Reordenação Kanban

**Decisão**: Usar as diretivas `CdkDragDrop`, `cdkDrag`, `cdkDropList` e `cdkDropListGroup` de `@angular/cdk/drag-drop`.

**Justificativa**: Faz parte do ecossistema Angular, mantida pela equipe do Angular, sem dependência de runtime além do próprio CDK. Suporta transferências entre listas (`transferArrayItem`) e reordenação dentro da mesma lista (`moveItemInArray`) — exatamente as duas operações necessárias. Funciona nativamente com o sistema de detecção de mudanças do Angular (sem conflitos com zone.js).

**Notas de implementação**:
- `cdkDropListGroup` envolve o container de colunas para que todas as instâncias `cdkDropList` se conheçam para drops entre colunas.
- Para reordenação de colunas, um `cdkDropList` separado envolve o container de colunas com `cdkDropListOrientation="horizontal"`.
- Cards e colunas NÃO devem compartilhar o mesmo grupo de drop; a reordenação de colunas usa sua própria lista externa.
- `[cdkDropListData]` faz binding ao array de cards do componente para cada coluna.
- O handler de drop recebe `CdkDragDrop<Card[]>` e chama `moveItemInArray` ou `transferArrayItem` antes da chamada PATCH (update otimista).

**Alternativas consideradas**:
- `@ng-dnd/core` (wrapper RxDND) — rejeitado; dependência extra, menos ergonômico para listas simples.
- Drag-and-drop nativo do HTML5 — rejeitado; wiring de eventos complexo, pouco amigável para mobile (fora do escopo, mas ainda uma preocupação de manutenção).

---

## Decisão 3: Layout CSS Puro (Colunas com Rolagem Horizontal)

**Decisão**: Usar um container flex (`display: flex; flex-direction: row; overflow-x: auto`) para a faixa de colunas. Cada coluna é um filho flex de largura fixa (`min-width: 280px`) com sua própria lista vertical de cards (`display: flex; flex-direction: column`).

**Justificativa**: Sem Material, Tailwind ou Bootstrap conforme a spec. CSS flex puro é suficiente para o layout Kanban. `overflow-x: auto` no canvas do board fornece rolagem nativa.

**Notas de implementação**:
- Container do board: `height: 100vh; overflow: hidden` — evita rolagem no nível da página.
- Faixa de colunas: `flex: 1; overflow-x: auto; display: flex; align-items: flex-start; gap: 12px; padding: 16px`.
- Wrapper da coluna: `min-width: 280px; max-width: 280px; background: #ebecf0; border-radius: 3px`.
- Lista de cards: `min-height: 8px` — necessário para que uma coluna vazia ainda seja um alvo de drop válido do CDK.

**Alternativas consideradas**: CSS Grid — rejeitado; flex com overflow-x é mais simples para um número desconhecido de colunas de tamanho igual.

---

## Decisão 4: HttpClient — Reativo vs Baseado em Promises

**Decisão**: Usar `HttpClient` com Observables do RxJS, fazendo subscribe dentro dos métodos do componente (`this.boardService.getBoards().subscribe(...)`). Sem `toPromise()` / `async-await`.

**Justificativa**: O HttpClient do Angular é nativo com Observables; envolvê-los em promises adiciona complexidade desnecessária. Para esta escala (app pessoal, sem necessidades complexas de cancelamento), `.subscribe()` simples é suficiente.

**Notas de implementação**:
- Prover via `provideHttpClient()` no `app.config.ts`.
- Variável de ambiente `environment.apiUrl = 'http://localhost:8080'` centraliza a URL base.
- Nenhum interceptor necessário (sem headers de autenticação).
- Tratamento de erro: `.subscribe({ error: err => console.error(err) })` é aceitável para v1.

**Alternativas consideradas**: `HttpClient` + async/await com `firstValueFrom` — válido, mas adiciona sobrecarga cognitiva sem benefício nesta escala.

---

## Decisão 5: Cálculo de Posição para Persistência do Drag-and-Drop

**Decisão**: A posição é baseada em 1 (`position = índiceNoArray + 1`). Após um evento de drop do CDK:
- Chamar `moveItemInArray` ou `transferArrayItem` para atualizar o array local primeiro (otimista).
- Calcular `novaPosition = event.currentIndex + 1`.
- Fazer PATCH apenas do item movido com `{ position: novaPosition }` (e `columnId` se for troca de coluna).
- O backend assume que NÃO requer renumeração de todas as posições dos irmãos.

**Justificativa**: A especificação define explicitamente esta fórmula. Fazer patch apenas do card movido minimiza o tráfego de rede. O backend é pré-existente e este contrato está definido no SDD.

**Alternativas consideradas**: Fazer patch de todos os irmãos afetados com novas posições — útil se o backend ordena exclusivamente pelo inteiro de posição; não necessário aqui conforme a spec.

---

## Decisão 6: Roteamento

**Decisão**: Duas rotas — `/` (HomeComponent) e `/board/:id` (BoardComponent) — configuradas em `app.routes.ts` com `provideRouter(routes)` no `app.config.ts`.

**Justificativa**: Roteamento simples baseado em path é idiomático no Angular 17. Lazy loading não é necessário para um app pessoal com duas telas.

**Notas de implementação**:
- `RouterOutlet` no template do `AppComponent`.
- `Router.navigate(['/board', id])` ao clicar no card do board; `routerLink` para links de navegação.
- `ActivatedRoute.params` para extrair `:id` no BoardComponent.

---

## Decisão 7: Formulários Inline para Criação (Board / Coluna / Card)

**Decisão**: Estado local template-driven com um toggle booleano `showAddForm` e um campo string `newItemName` por componente. Sem `ReactiveFormsModule`; usar binding de template Angular `[(ngModel)]` ou binding de evento simples.

**Justificativa**: Os formulários têm apenas um campo cada (nome/título). Reactive forms adicionam cerimônia sem benefício. `FormsModule` importado em cada componente standalone para `ngModel`.

**Alternativas consideradas**: Reactive forms — rejeitado; desnecessariamente complexo para uma única entrada de texto.

---

## Pontos em Aberto Resolvidos

| Item | Resolução |
|------|-----------|
| Versão do framework | Angular 17, TypeScript 5.x |
| Versão do CDK | @angular/cdk correspondente ao Angular 17 (^17.x) |
| Biblioteca de drag-and-drop | @angular/cdk/drag-drop |
| Abordagem CSS | Flexbox puro, sem framework |
| Padrão HTTP | HttpClient baseado em Observable |
| Fórmula de posição | Base 1: `índice + 1` |
| Abordagem de formulários | Template-driven, campo único |
| Roteamento | `provideRouter`, duas rotas |
