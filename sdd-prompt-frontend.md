/speckit.specify

Quero construir o FRONTEND de um sistema de board estilo Trello para uso pessoal.
Framework: Angular 17 standalone (sem NgModule).
O backend já existe em http://localhost:8080 — apenas consumir a API REST dele.

--- FUNCIONALIDADES ---

Tela de boards (home /):
- Listar todos os boards em cards clicáveis
- Formulário inline para criar novo board (campo nome + botão)
- Botão para excluir board (com confirmação simples)

Tela do board (/board/:id):
- Exibir nome do board no topo
- Mostrar colunas lado a lado em layout horizontal com scroll
- Cada coluna exibe seus cards em ordem (campo position)
- Botão para adicionar nova coluna (campo nome inline)
- Dentro de cada coluna: botão para adicionar novo card (campo título inline)
- Drag-and-drop de cards entre colunas e dentro da mesma coluna
  → ao soltar, chama PATCH /api/cards/{id} com o novo columnId e position calculado
- Drag-and-drop de colunas para reordenar no board
  → ao soltar, chama PATCH /api/columns/{id} com novo position
- Botão excluir coluna e excluir card

--- STACK ---

- Angular 17 standalone (sem NgModule)
- @angular/cdk/drag-drop para drag-and-drop
- HttpClient via provideHttpClient() no app.config.ts
- CSS puro (sem Angular Material, sem Tailwind, sem Bootstrap)
- Roteamento com RouterModule / provideRouter()

--- CONTRATOS DA API (o que o frontend vai consumir) ---

GET    /api/boards                       → Board[]
POST   /api/boards                       → body: { name }  → Board
DELETE /api/boards/{id}                  → 204

GET    /api/boards/{boardId}/columns     → Column[] (cada Column tem cards: Card[] embutidos)
POST   /api/boards/{boardId}/columns     → body: { name }  → Column
PATCH  /api/columns/{id}                 → body: { name?, position? }  → Column
DELETE /api/columns/{id}                 → 204

POST   /api/columns/{columnId}/cards     → body: { title, description?, label? }  → Card
PATCH  /api/cards/{id}                   → body: { title?, description?, label?, position?, columnId? }  → Card
DELETE /api/cards/{id}                   → 204

--- MODELOS TYPESCRIPT ---

interface Board {
  id: number;
  name: string;
  createdAt: string;
}

interface Card {
  id: number;
  columnId: number;
  title: string;
  description?: string;
  label?: string;
  position: number;
  completed: boolean;
  createdAt: string;
}

interface Column {
  id: number;
  boardId: number;
  name: string;
  position: number;
  cards: Card[];
}

--- ESTRUTURA DE ARQUIVOS ESPERADA ---

src/app/
├── models/
│   ├── board.model.ts
│   ├── column.model.ts
│   └── card.model.ts
├── services/
│   ├── board.service.ts
│   ├── column.service.ts
│   └── card.service.ts
├── pages/
│   ├── home/
│   │   ├── home.component.ts
│   │   └── home.component.html
│   └── board/
│       ├── board.component.ts
│       └── board.component.html
├── app.routes.ts
├── app.config.ts
└── app.component.ts

src/environments/
└── environment.ts   (apiUrl: 'http://localhost:8080')

--- LÓGICA DO DRAG-AND-DROP (PONTO CRÍTICO) ---

Usar cdkDropList + cdkDrag do @angular/cdk/drag-drop.

Ao soltar um card (evento CdkDragDrop<Card[]>):
1. Se mudou de coluna (previousContainer !== container):
   - Chamar transferArrayItem() para atualizar o array local imediatamente (UX responsiva)
   - Calcular o novo position = índice do card na nova lista + 1
   - Chamar PATCH /api/cards/{id} com { columnId: novaColuna.id, position: novoIndex }
2. Se ficou na mesma coluna:
   - Chamar moveItemInArray() para atualizar o array local
   - Calcular o novo position = novo índice + 1
   - Chamar PATCH /api/cards/{id} com { position: novoIndex }

Ao soltar uma coluna (reordenação de colunas):
- Chamar moveItemInArray() local
- Chamar PATCH /api/columns/{id} com { position: novoIndex + 1 } para cada coluna afetada
  (ou apenas para a coluna movida, conforme suporte do backend)

--- CRITÉRIOS DE ACEITE ---

- [ ] Tela home lista boards e permite criar/excluir
- [ ] Clicar em board navega para /board/:id
- [ ] Colunas aparecem lado a lado com scroll horizontal
- [ ] Cards aparecem dentro das colunas ordenados por position
- [ ] Posso adicionar coluna com nome via formulário inline
- [ ] Posso adicionar card com título via formulário inline em cada coluna
- [ ] Drag-and-drop move card entre colunas e persiste no backend
- [ ] Drag-and-drop reordena card dentro da coluna e persiste
- [ ] Drag-and-drop reordena colunas e persiste
- [ ] Posso excluir coluna e card
- [ ] Sem erros de CORS (backend já libera :4200)

--- FORA DO ESCOPO v1 ---
- Login / autenticação
- Edição inline de título de card já criado
- Detalhes do card em modal (descrição, label)
- Dark mode
- Responsividade mobile


--- PRÓXIMOS PASSOS APÓS O SPECIFY ---

/speckit.plan   Angular 17 standalone, CDK drag-drop, HttpClient, CSS puro, rotas /  e /board/:id
/speckit.tasks
/speckit.implement
