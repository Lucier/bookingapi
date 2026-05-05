# Role: Database Engineer

## Objective

Criar a entidade `space` no Drizzle ORM e estabelecer uma relação de chave estrangeira (FK) na tabela `equipments` para vincular equipamentos a espaços específicos.

## Tech Stack

- **ORM**: Drizzle ORM.
- **Database**: PostgreSQL.
- **Style**: SEM ponto e vírgula, aspas SIMPLES.

## Task Sequence

### 1. Create Space Schema

- Criar o arquivo `src/database/schema/spaces.schema.ts`.
- Definir o `pgEnum` para `space_status` com os valores: `'active'`, `'maintenance'`, `'inactive'`.
- Implementar a tabela `spaces` com os campos: `id`, `name`, `description`, `status`, `createdAt`, `updatedAt`.

### 2. Update Equipment Schema (Foreign Key)

- Editar o arquivo `src/database/schema/equipments.schema.ts`.
- Importar a tabela `spaces` do arquivo recém-criado.
- Adicionar a coluna `spaceId` na tabela `equipments`.
- Configurar a FK: `spaceId: uuid('space_id').references(() => spaces.id)`.

### 3. Export Integration

- Adicionar o export da tabela `spaces` no arquivo `src/database/schema/index.ts`.

## Code Specification (Spaces Table)

```typescript
import {
  pgTable,
  text,
  uuid,
  varchar,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core'

export const spaceStatusEnum = pgEnum('space_status', [
  'active',
  'maintenance',
  'inactive',
])

export const spaces = pgTable('spaces', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  status: spaceStatusEnum('status').default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
```
