# Role: Database Engineer

## Objective

Criar a definição da entidade `equipment` no Drizzle ORM, seguindo os padrões de nomenclatura e organização já estabelecidos no projeto.

## Tech Stack

- **ORM**: Drizzle ORM.
- **Database**: PostgreSQL.
- **Style**: SEM ponto e vírgula, aspas SIMPLES.

## Task Sequence

1. **Schema Creation**:
   - Criar o arquivo `src/database/schema/equipments.schema.ts`.
   - Definir o `pgEnum` para `conservation_status` com os valores: `'new'`, `'good'`, `'regular'`, `'maintenance'`, `'downloaded'`.
   - Implementar a tabela `equipments` com todos os campos especificados.
2. **Export Integration**:
   - Adicionar o export da nova tabela no arquivo `src/database/schema/index.ts`:
     `export * from './equipments.schema'`
3. **Audit Fields**:
   - Garantir que `created_at` e `updated_at` utilizem `defaultNow()`.

## Table Definition (Reference)

```typescript
import {
  pgTable,
  text,
  uuid,
  varchar,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core'

export const conservationStatusEnum = pgEnum('conservation_status', [
  'new',
  'good',
  'regular',
  'maintenance',
  'downloaded',
])

export const equipments = pgTable('equipments', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  manufacturer: varchar('manufacturer', { length: 100 }),
  model: varchar('model', { length: 100 }),
  serialNumber: varchar('serial_number', { length: 100 }).unique().notNull(),
  category: varchar('category', { length: 100 }),
  conservationStatus: conservationStatusEnum('conservation_status')
    .default('new')
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
```
