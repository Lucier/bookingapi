# Role: NestJS & Inventory Systems Architect

## Objective

Implementar o módulo `MovingEquipment` (Movimentação) para rastrear o histórico de trocas de local, manutenções e baixas de equipamentos. O foco deve ser na integridade dos dados e auditoria.

## Tech Stack

- **Framework**: NestJS
- **ORM**: Drizzle ORM
- **Validation**: Zod & `nestjs-zod`
- **Testing**: Vitest
- **Style**: SEM ponto e vírgula, aspas SIMPLES.

## Task Sequence

### 1. Folder Structure

Criar a estrutura em `src/modules/moving/`:

- `controllers/`, `services/`, `repositories/`, `dto/`, `validators/`, `specs/`, `tests/`.

### 2. DTOs & Validation

- Criar schemas Zod para:
  - `CreateMovementSchema`: `equipmentId`, `originSpaceId` (opcional), `destinationSpaceId` (opcional), `movementType` (enum), `description`.
  - `UpdateMovementSchema`: Campos opcionais para correções administrativas.
- Validar se o `movementType` respeita o `pgEnum` definido no schema do Drizzle.

### 3. Repository Layer

- **File**: `src/modules/moving/repositories/moving.repository.ts`
- Implementar as queries usando Drizzle:
  - `create`: Salvar o registro de movimentação.
  - `findAll`: Listar com **Join** opcional para trazer nomes de equipamentos e espaços.
  - `findById`: Detalhes de uma movimentação específica.
  - `update/delete`: Apenas para correções de log (com restrição de Role).

### 4. Service Layer (Regras de Negócio)

- **File**: `src/modules/moving/moving.service.ts`
- **Regras Críticas**:
  - Ao criar uma movimentação, injetar o `userId` do usuário autenticado automaticamente.
  - Validar se o `equipmentId` existe antes de registrar a movimentação.
  - Se for um tipo `'transfer'`, garantir que `destinationSpaceId` foi fornecido.

### 5. Controller Layer

- **File**: `src/modules/moving/moving.controller.ts`
- Rotas: `POST /moving`, `GET /moving`, `GET /moving/:id`, `PATCH /moving/:id`, `DELETE /moving/:id`.
- Utilizar o `@Req()` para extrair o `user.id` do JWT e passar para o Service.

### 6. Automated Testing (Atenção Redobrada)

- **Unit Specs (`specs/`)**:
  - Testar se o Service lança erro ao tentar mover um equipamento inexistente.
  - Testar se o `userId` está sendo vinculado corretamente ao registro.
- **E2E Tests (`tests/`)**:
  - Simular um fluxo real: Criar um equipamento -> Criar um espaço -> Realizar movimentação -> Verificar se o registro aparece no `findAll`.

## Code Specifications

- **Logging**: O registro de movimentação deve ser considerado "imutável" por padrão (apenas ADMIN pode alterar/deletar logs de erro).
- **Architecture**: Injetar `MovingRepository` no `MovingService`.

## Validation

- O Claude deve garantir que o `MovingModule` esteja registrado no `AppModule`.
- Verificar se as FKs de `user_id`, `equipment_id` e `space_id` estão populadas corretamente no banco após o teste.
