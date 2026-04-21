# Contratos de API: Frontend de Board Estilo Trello

**Fase**: 1 — Design  
**Data**: 2026-04-20  
**URL base do backend**: `http://localhost:8080`

Estes são os endpoints da API REST que o frontend consome. O backend é pré-existente; este documento registra o contrato para referência durante a implementação.

---

## Boards

### GET /api/boards

Retorna todos os boards.

**Resposta** `200 OK`:
```json
[
  { "id": 1, "name": "Meu Board", "createdAt": "2026-04-20T10:00:00Z" }
]
```

---

### POST /api/boards

Cria um novo board.

**Corpo da requisição**:
```json
{ "name": "Meu Board" }
```

**Resposta** `201 Created`:
```json
{ "id": 2, "name": "Meu Board", "createdAt": "2026-04-20T10:01:00Z" }
```

---

### DELETE /api/boards/{id}

Exclui um board e todas as suas colunas/cards.

**Resposta** `204 No Content`

---

## Colunas

### GET /api/boards/{boardId}/columns

Retorna todas as colunas de um board, cada uma com seus cards embutidos e ordenados por `position` crescente.

**Resposta** `200 OK`:
```json
[
  {
    "id": 10,
    "boardId": 1,
    "name": "A Fazer",
    "position": 1,
    "cards": [
      {
        "id": 100,
        "columnId": 10,
        "title": "Corrigir bug",
        "description": null,
        "label": null,
        "position": 1,
        "completed": false,
        "createdAt": "2026-04-20T10:02:00Z"
      }
    ]
  }
]
```

---

### POST /api/boards/{boardId}/columns

Cria uma nova coluna.

**Corpo da requisição**:
```json
{ "name": "Em Progresso" }
```

**Resposta** `201 Created`:
```json
{ "id": 11, "boardId": 1, "name": "Em Progresso", "position": 2, "cards": [] }
```

---

### PATCH /api/columns/{id}

Atualiza o nome ou a posição de uma coluna.

**Corpo da requisição** (todos os campos opcionais):
```json
{ "name": "Renomeado", "position": 3 }
```

**Resposta** `200 OK`: objeto Column atualizado.

---

### DELETE /api/columns/{id}

Exclui uma coluna e todos os seus cards.

**Resposta** `204 No Content`

---

## Cards

### POST /api/columns/{columnId}/cards

Cria um novo card em uma coluna.

**Corpo da requisição**:
```json
{ "title": "Nova tarefa", "description": "opcional", "label": "opcional" }
```

**Resposta** `201 Created`: objeto Card completo.

---

### PATCH /api/cards/{id}

Atualiza campos, posição ou coluna de um card.

**Corpo da requisição** (todos os campos opcionais):
```json
{ "title": "Atualizado", "description": "...", "label": "...", "position": 2, "columnId": 11 }
```

**Frontend envia ao reordenar na mesma coluna**:
```json
{ "position": 2 }
```

**Frontend envia ao fazer drop em outra coluna**:
```json
{ "columnId": 11, "position": 1 }
```

**Resposta** `200 OK`: objeto Card atualizado.

---

### DELETE /api/cards/{id}

Exclui um card.

**Resposta** `204 No Content`

---

## Tratamento de Erros (v1)

O frontend registra erros no console e não faz retry automático nem rollback na v1. Falhas de rede após updates otimistas deixarão a interface no estado atualizado até que o usuário atualize a página.
