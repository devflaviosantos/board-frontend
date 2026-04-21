# Modelo de Dados: Frontend de Board Estilo Trello

**Fase**: 1 — Design  
**Data**: 2026-04-20  
**Feature**: [spec.md](spec.md)

---

## Entidades

### Board

Representa um container de nível mais alto para projetos.

| Campo | Tipo | Observações |
|-------|------|-------------|
| `id` | `number` | Identificador atribuído pelo servidor; somente leitura |
| `name` | `string` | Nome exibido definido pelo usuário; obrigatório |
| `createdAt` | `string` | Timestamp ISO 8601; somente leitura |

**Relacionamentos**: Um Board possui zero ou mais Colunas.

**Validações**:
- `name` deve ser não vazio antes de enviar uma requisição de criação.

---

### Coluna

Representa uma lane ordenada dentro de um Board.

| Campo | Tipo | Observações |
|-------|------|-------------|
| `id` | `number` | Identificador atribuído pelo servidor; somente leitura |
| `boardId` | `number` | FK para o Board proprietário; somente leitura |
| `name` | `string` | Nome exibido definido pelo usuário; obrigatório |
| `position` | `number` | Inteiro base 1; menor = mais à esquerda |
| `cards` | `Card[]` | Array embutido; retornado por `GET /api/boards/:boardId/columns` |

**Relacionamentos**: Uma Coluna pertence a exatamente um Board e possui zero ou mais Cards.

**Validações**:
- `name` deve ser não vazio antes de enviar uma requisição de criação.
- `position` é sempre um inteiro positivo; o frontend calcula como `índiceNoArray + 1`.

**Transições de Estado**:
- Criada → `POST /api/boards/:boardId/columns`
- Reordenada → `PATCH /api/columns/:id { position }` (após drag-and-drop)
- Excluída → `DELETE /api/columns/:id`

---

### Card

Representa um item de tarefa dentro de uma Coluna.

| Campo | Tipo | Observações |
|-------|------|-------------|
| `id` | `number` | Identificador atribuído pelo servidor; somente leitura |
| `columnId` | `number` | FK para a Coluna proprietária; mutável (muda em drop entre colunas) |
| `title` | `string` | Resumo definido pelo usuário; obrigatório |
| `description` | `string \| undefined` | Texto livre opcional; fora do escopo da UI v1 |
| `label` | `string \| undefined` | Tag opcional; fora do escopo da UI v1 |
| `position` | `number` | Inteiro base 1 dentro da coluna; menor = mais acima na lista |
| `completed` | `boolean` | Flag de tarefa concluída; fora do escopo da UI v1 (exibição somente leitura) |
| `createdAt` | `string` | Timestamp ISO 8601; somente leitura |

**Relacionamentos**: Um Card pertence a exatamente uma Coluna (e transitivamente a um Board).

**Validações**:
- `title` deve ser não vazio antes de enviar uma requisição de criação.
- `position` é sempre um inteiro positivo; o frontend calcula como `índiceNoArray + 1`.
- `columnId` muda somente durante um drag-and-drop entre colunas.

**Transições de Estado**:
- Criado → `POST /api/columns/:columnId/cards { title }`
- Movido dentro da coluna → `PATCH /api/cards/:id { position }`
- Movido para nova coluna → `PATCH /api/cards/:id { columnId, position }`
- Excluído → `DELETE /api/cards/:id`

---

## Formato do Estado no Frontend

Os componentes Angular mantêm o seguinte estado em memória (não persistido localmente):

```
HomeComponent
  └── boards: Board[]          — carregado de GET /api/boards

BoardComponent
  └── board: Board             — identidade (id, name) usada no cabeçalho
  └── columns: Column[]        — carregado de GET /api/boards/:id/columns
       └── cada column.cards   — ordenado por position asc; mutado pelos handlers de drag-drop
```

**Invariante de ordenação**: `column.cards` é sempre ordenado por `position` crescente após o carregamento e após cada operação de drag-and-drop. O frontend mantém este invariante; não faz nova requisição após mutações.

---

## Interfaces TypeScript (canônicas)

```typescript
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
```
