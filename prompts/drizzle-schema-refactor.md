# Role: Database Engineer

## Objective

Reorganizar a estrutura de schemas do Drizzle ORM e atualizar a definição da tabela de usuários para incluir suporte a autenticação e campos de auditoria (timestamps).

## Tech Stack

- **ORM**: Drizzle ORM.
- **Style**: SEM ponto e vírgula, aspas SIMPLES.

## Task Sequence

1. **Directory Management**:
   - Criar o diretório `src/database/schema/` se ainda não existir.
2. **File Migration & Enhancement**:
   - Mover `src/database/schema.ts` para `src/database/schema/users.schema.ts`.
   - **Update Schema**: Adicionar os campos `passwordHash`, `createdAt` e `updatedAt`.
3. **Index Creation**:
   - Criar `src/database/schema/index.ts` com: `export * from './users.schema'`.
4. **Update Configurations**:
   - Atualizar `drizzle.config.ts` para apontar para o novo diretório ou arquivo de schema.
   - Atualizar o provider/módulo do Drizzle para importar o schema unificado.

## Code Specification (User Table)

Implementar a tabela seguindo este padrão:

```typescript
import { pgTable, text, uuid, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
```
