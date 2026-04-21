# Plano de Implementação: Frontend de Board Estilo Trello

**Branch**: `001-trello-board-frontend` | **Data**: 2026-04-20 | **Spec**: [spec.md](spec.md)  
**Entrada**: Especificação da feature em `/specs/001-trello-board-frontend/spec.md`

## Resumo

Construir uma SPA Angular 17 standalone que permite ao usuário gerenciar boards Kanban pessoais. O app consome uma API REST existente em `http://localhost:8080`, renderiza boards, colunas e cards com `@angular/cdk/drag-drop` para reordenação, e persiste cada mudança de posição no backend via updates otimistas.

## Contexto Técnico

**Linguagem/Versão**: TypeScript 5.x / Angular 17  
**Dependências Principais**: Angular 17 standalone, @angular/cdk (drag-drop), @angular/common/http (HttpClient)  
**Armazenamento**: Nenhum — todo o estado é gerenciado via API REST em `http://localhost:8080`  
**Testes**: Angular TestBed / Jasmine (unitário; opcional para v1)  
**Plataforma Alvo**: Navegador desktop moderno (Chrome, Firefox, Edge), servido em `http://localhost:4200`  
**Tipo de Projeto**: Single-Page Application (SPA) — puramente frontend  
**Metas de Performance**: Updates otimistas visíveis em <200ms após drag-and-drop; página carrega em menos de 3s  
**Restrições**: Zero autenticação, estilização somente CSS (sem Material/Tailwind/Bootstrap), sem NgModules  
**Escala/Escopo**: Uso pessoal — poucos boards, ~10 colunas por board, ~100 cards por board

## Verificação da Constituição

Nenhuma constituição de projeto está configurada. Nenhuma restrição se aplica. Prosseguindo diretamente.

## Estrutura do Projeto

### Documentação (esta feature)

```text
specs/001-trello-board-frontend/
├── plan.md              ← este arquivo
├── research.md          ← saída da Fase 0
├── data-model.md        ← saída da Fase 1
├── quickstart.md        ← saída da Fase 1
├── contracts/           ← saída da Fase 1
│   └── api-contracts.md
└── tasks.md             ← saída da Fase 2 (/speckit.tasks — NÃO criado aqui)
```

### Código-Fonte (raiz do repositório)

```text
src/
├── app/
│   ├── models/
│   │   ├── board.model.ts
│   │   ├── column.model.ts
│   │   └── card.model.ts
│   ├── services/
│   │   ├── board.service.ts
│   │   ├── column.service.ts
│   │   └── card.service.ts
│   ├── pages/
│   │   ├── home/
│   │   │   ├── home.component.ts
│   │   │   └── home.component.html
│   │   └── board/
│   │       ├── board.component.ts
│   │       └── board.component.html
│   ├── app.routes.ts
│   ├── app.config.ts
│   └── app.component.ts
└── environments/
    └── environment.ts
```

**Decisão de Estrutura**: Projeto Angular único. Nenhum diretório de backend (o backend é um serviço independente pré-existente). Padrão SPA somente frontend.

## Rastreamento de Complexidade

*Nenhuma violação de constituição a justificar.*
