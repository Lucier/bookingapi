# Role: NestJS & Booking Systems Expert

## Objective

Implementar o módulo de `Scheduling` para gerenciar reservas de espaços. Este módulo deve garantir que não haja sobreposição de horários para o mesmo espaço e que as regras de integridade referencial sejam respeitadas.

## Tech Stack

- **Framework**: NestJS
- **ORM**: Drizzle ORM (PostgreSQL)
- **Validation**: Zod & `nestjs-zod`
- **Testing**: Vitest (Unitários e E2E)
- **Style**: SEM ponto e vírgula, aspas SIMPLES.

## Task Sequence

### 1. Folder Structure

Criar em `src/modules/scheduling/`:

- `controllers/`, `services/`, `repositories/`, `dto/`, `validators/`, `specs/`, `tests/`.

### 2. DTOs & Business Validation (Zod)

- **CreateSchedulingSchema**:
  - `spaceId` (UUID)
  - `activityDescription` (Text)
  - `schedulingDate` (ISO Date string)
  - `startTime` (HH:mm)
  - `endTime` (HH:mm)
- **Custom Rule**: Validar se `startTime` é anterior a `endTime`.

### 3. Repository Layer

- **File**: `src/modules/scheduling/repositories/scheduling.repository.ts`
- **Métodos**:
  - `create`, `findAll`, `findById`, `delete`.
  - **`findOverlapping`**: Método crucial que verifica no banco se já existe um agendamento para o mesmo `spaceId` na mesma `schedulingDate` onde os horários se sobreponham.

### 4. Service Layer (Core Logic)

- **File**: `src/modules/scheduling/scheduling.service.ts`
- **Regras de Negócio**:
  - **Prevenção de Conflito**: Antes de criar, chamar `repository.findOverlapping`. Se houver conflito, lançar `ConflictException`.
  - **Injeção de Identidade**: O `userId` deve ser extraído do usuário autenticado.
  - **Validação de Espaço**: Verificar se o espaço existe e está com status `'active'`.

### 5. Controller Layer

- **File**: `src/modules/scheduling/scheduling.controller.ts`
- **Rotas**: `POST /scheduling`, `GET /scheduling`, `GET /scheduling/:id`, `DELETE /scheduling/:id`.
- Proteger todas as rotas com `JwtAuthGuard`.

### 6. Automated Testing (Foco em Casos de Borda)

- **Unit Specs (`specs/`)**:
  - Testar sucesso no agendamento.
  - Testar falha por sobreposição de horário (Overlap).
  - Testar falha ao tentar agendar em um espaço inexistente.
- **E2E Tests (`tests/`)**:
  - Fluxo: Login -> Criar Espaço -> Agendar Horário -> Tentar agendar mesmo horário (deve falhar).

## Code Specifications

- **Time Handling**: Garantir que as strings de tempo (start/end) sejam tratadas corretamente para comparação no PostgreSQL.
- **Joins**: No `findAll`, trazer informações básicas do `Space` e do `User`.

## Validation

- O Claude deve garantir que o `SchedulingModule` esteja registrado no `AppModule`.
- Verificar se a lógica de Overlap utiliza operadores `>=` e `<=` corretamente para cobrir todos os cenários de colisão de tempo.
