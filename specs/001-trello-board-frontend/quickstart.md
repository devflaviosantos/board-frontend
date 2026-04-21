# Guia de Início Rápido: Frontend de Board Estilo Trello

## Pré-requisitos

- Node.js 18+ e npm 9+
- Angular CLI 17: `npm install -g @angular/cli@17`
- Backend rodando em `http://localhost:8080`

## Configuração

```bash
# Instalar dependências (Angular + CDK)
npm install

# Verificar se o CDK está instalado
npm ls @angular/cdk
```

Se `@angular/cdk` não estiver instalado:
```bash
npm install @angular/cdk@17
```

## Rodando o servidor de desenvolvimento

```bash
ng serve
# Abre em http://localhost:4200
```

O app não usa proxy — chama `http://localhost:8080` diretamente. Certifique-se de que o backend está rodando e com CORS habilitado para `http://localhost:4200`.

## Build para produção

```bash
ng build
# Saída em dist/board-frontend/
```

## Estrutura do projeto

```
src/
├── app/
│   ├── models/           # Interfaces Board, Column, Card
│   ├── services/         # BoardService, ColumnService, CardService (HttpClient)
│   ├── pages/
│   │   ├── home/         # / — lista de boards + criar/excluir
│   │   └── board/        # /board/:id — colunas + cards + drag-drop
│   ├── app.routes.ts
│   ├── app.config.ts     # provideRouter, provideHttpClient
│   └── app.component.ts  # Wrapper com RouterOutlet
└── environments/
    └── environment.ts    # apiUrl: 'http://localhost:8080'
```

## Arquivos principais

| Arquivo | Propósito |
|---------|-----------|
| [app.config.ts](../../src/app/app.config.ts) | Providers de bootstrap (router, HttpClient) |
| [app.routes.ts](../../src/app/app.routes.ts) | Definição de rotas |
| [environment.ts](../../src/environments/environment.ts) | URL base da API |
| [board.component.ts](../../src/app/pages/board/board.component.ts) | Lógica de drag-drop |

## Solução de Problemas

**Erro de CORS no console do navegador**: Confirme que o backend serve `Access-Control-Allow-Origin: http://localhost:4200`.

**`CdkDrag` não funciona**: Verifique se `DragDropModule` (ou as diretivas individuais `CdkDragDrop`) estão importados no componente standalone.

**Cards não ordenados corretamente**: O backend retorna cards ordenados por `position`; o frontend ordena no carregamento: `column.cards.sort((a, b) => a.position - b.position)`.
