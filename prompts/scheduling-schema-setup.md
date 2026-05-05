# Role: Database Engineer

## Objective

Criar a entidade `scheduling` no Drizzle ORM para gerenciar as reservas de espaços, estabelecendo as relações necessárias com usuários e espaços.

## Tech Stack

- **ORM**: Drizzle ORM.
- **Database**: PostgreSQL.
- **Style**: SEM ponto e vírgula, aspas SIMPLES.

## Task Sequence

### 1. Schema Creation

- Criar o arquivo `src/database/schema/scheduling.schema.ts`.
- Implementar a tabela `scheduling` com as seguintes chaves estrangeiras:
  - `userId`: FK para `users.id` (quem realizou o agendamento).
  - `spaceId`: FK para `spaces.id` (qual espaço está sendo reservado).
- Utilizar os tipos específicos do Postgres para tempo: `date` para o dia e `time` para o período.

### 2. Export Integration

- Adicionar o export da tabela no arquivo `src/database/schema/index.ts`.

## Code Specification (Scheduling Table)

```typescript
import { pgTable, text, uuid, timestamp, date, time } from 'drizzle-orm/pg-core'
import { users } from './users.schema'
import { spaces } from './spaces.schema'

export const scheduling = pgTable('scheduling', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  spaceId: uuid('space_id')
    .references(() => spaces.id)
    .notNull(),
  activityDescription: text('activity_description').notNull(),
  schedulingDate: date('scheduling_date').notNull(),
  startTime: time('start_time').notNull(),
  endTime: time('end_time').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
```
