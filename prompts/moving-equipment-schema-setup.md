# Role: Database Engineer

## Objective

Criar a entidade `moving_equipment` no Drizzle ORM para rastrear o histórico de movimentações, transferências e manutenções de equipamentos entre espaços ou usuários.

## Tech Stack

- **ORM**: Drizzle ORM.
- **Database**: PostgreSQL.
- **Style**: SEM ponto e vírgula, aspas SIMPLES.

## Task Sequence

### 1. Schema Creation

- Criar o arquivo `src/database/schema/moving-equipment.schema.ts`.
- Definir o `pgEnum` para `movement_type` com os valores: `'transfer'`, `'maintenance'`, `'loan'`, `'write-off'`.
- Implementar a tabela `moving_equipment` com as seguintes chaves estrangeiras:
  - `equipmentId`: FK para `equipments.id`.
  - `userId`: FK para `users.id` (quem realizou a movimentação).
  - `originSpaceId`: FK para `spaces.id` (opcional, nulo se for entrada nova).
  - `destinationSpaceId`: FK para `spaces.id` (opcional, nulo se for baixa).

### 2. Export Integration

- Adicionar o export da tabela no arquivo `src/database/schema/index.ts`.

## Code Specification (Moving Equipment Table)

```typescript
import { pgTable, text, uuid, timestamp, pgEnum } from 'drizzle-orm/pg-core'
import { users } from './users.schema'
import { equipments } from './equipments.schema'
import { spaces } from './spaces.schema'

export const movementTypeEnum = pgEnum('movement_type', [
  'transfer',
  'maintenance',
  'loan',
  'write-off',
])

export const movingEquipment = pgTable('moving_equipment', {
  id: uuid('id').defaultRandom().primaryKey(),
  equipmentId: uuid('equipment_id')
    .references(() => equipments.id)
    .notNull(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  originSpaceId: uuid('origin_space_id').references(() => spaces.id),
  destinationSpaceId: uuid('destination_space_id').references(() => spaces.id),
  movementType: movementTypeEnum('movement_type').notNull(),
  description: text('description'),
  movementDate: timestamp('movement_date').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
```
