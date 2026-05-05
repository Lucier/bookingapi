# Role: NestJS & Backend Architect

## Objective

Criar o módulo completo de `Spaces` seguindo a arquitetura modular do NestJS, utilizando Drizzle ORM para persistência e Zod para validação de dados.

## Tech Stack

- **Framework**: NestJS
- **ORM**: Drizzle ORM
- **Validation**: Zod (via `nestjs-zod`)
- **Testing**: Vitest
- **Style**: SEM ponto e vírgula, aspas SIMPLES.

## Task Sequence

### 1. Folder Structure

Criar a seguinte árvore de diretórios:

- `src/modules/spaces/`
- `src/modules/spaces/dto/`
- `src/modules/spaces/validators/`
- `src/modules/spaces/specs/` (Unitários)
- `src/modules/spaces/tests/` (E2E)

### 2. DTOs & Validators

- Criar schemas Zod para:
  - `CreateSpaceSchema`: `name`, `description`, `status`.
  - `UpdateSpaceSchema`: Mesmos campos, porém opcionais.
- Utilizar `createZodDto` para gerar os DTOs a partir dos schemas.

### 3. Repository Implementation

- **File**: `src/modules/spaces/repositories/spaces.repository.ts`
- Implementar métodos que utilizam o `DrizzleService` diretamente:
  - `create`, `findAll`, `findById`, `update`, `delete`.

### 4. Service Layer (Business Logic)

- **File**: `src/modules/spaces/spaces.service.ts`
- Injetar o `SpacesRepository`.
- Implementar métodos:
  - `findAll`: Retornar todos os espaços.
  - `findOne`: Buscar por ID e lançar `NotFoundException` se não existir.
  - `update`: Atualizar dados e validar existência.
  - `remove`: Deletar e validar existência.

### 5. Controller Layer

- **File**: `src/modules/spaces/spaces.controller.ts`
- Implementar as rotas:
  - `POST /spaces`
  - `GET /spaces`
  - `GET /spaces/:id`
  - `PATCH /spaces/:id`
  - `DELETE /spaces/:id`
- Aplicar o `AuthGuard` e proteger as rotas de escrita com `@Roles('ADMIN')`.

### 6. Module Registration

- Criar `src/modules/spaces/spaces.module.ts`.
- Exportar o `SpacesService` e o `SpacesRepository` caso outros módulos (como `Equipments`) precisem deles.

### 7. Automated Tests

- **Unitários (`specs/`)**: Testar o `SpacesService` mockando o Repository. Garantir que as exceções de "não encontrado" sejam disparadas.
- **E2E (`tests/`)**: Testar o fluxo completo via supertest (request HTTP -> Controller -> DB).

## Code Specifications

- **Naming**: PascalCase para classes, camelCase para métodos e arquivos.
- **Errors**: Usar exceções nativas do NestJS (`NotFoundException`, `BadRequestException`).
- **Imports**: Usar aliases se configurados (ex: `@/database/...`).

## Validation

- O Claude deve garantir que o `SpacesModule` seja importado no `AppModule`.
- Verificar se as rotas aparecem corretamente no Swagger.
