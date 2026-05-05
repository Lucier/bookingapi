# Role: Database Architect & NestJS Expert

## Objective

Configurar o Drizzle ORM em um projeto NestJS existente. Foco em performance, tipagem forte e conformidade com o estilo de código.

## Tech Stack

- **ORM**: Drizzle ORM.
- **Driver**: postgres (ou pg).
- **Migration Tool**: drizzle-kit.
- **Style**: SEM ponto e vírgula, aspas SIMPLES.

## Task Sequence

1. **Dependencies**:
   - Instale `drizzle-orm` e o driver de banco (ex: `postgres`).
   - Instale como devDependencies: `drizzle-kit`, `@types/pg` e `dotenv`.
2. **Directory Structure**:
   - Criar pasta `src/database`.
   - Criar `src/database/schema.ts` (exemplo inicial de tabela 'users').
   - Criar `src/database/drizzle.provider.ts` para injeção de dependência no NestJS.
3. **Configuration Files**:
   - Criar `drizzle.config.ts` na raiz para o `drizzle-kit`.
   - Criar ou atualizar o arquivo `.env` com a variável `DATABASE_URL`.
4. **Integration**:
   - Criar um `DatabaseModule` em `src/database/database.module.ts` para exportar a instância do banco (db).
   - Importar o `DatabaseModule` no `AppModule`.
5. **Scripts**:
   - Adicionar ao `package.json`:
     - `"db:generate": "drizzle-kit generate"`
     - `"db:migrate": "drizzle-kit migrate"`
     - `"db:studio": "drizzle-kit studio"`

## Code Specifications

- Usar o padrão de exportação do NestJS para Providers.
- Garantir que todos os novos arquivos utilizem `singleQuote: true` e `semi: false`.
- Configurar o Drizzle para carregar variáveis de ambiente via `dotenv`.

## Validation

- Verificar se o comando `npx drizzle-kit generate` é capaz de ler o schema criado.
