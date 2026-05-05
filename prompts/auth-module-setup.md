# Role: Cyber Security & NestJS Architect

## Objective

Implementar um sistema de autenticação completo (JWT + Refresh Tokens) com controle de acesso por Roles, garantindo que o registro padrão de novos usuários seja obrigatoriamente com a role 'USER'.

## Tech Stack

- **Auth**: `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`, `bcrypt`.
- **Validation**: `zod`, `nestjs-zod`.
- **Style**: SEM ponto e vírgula, aspas SIMPLES.

## Task Sequence

### 1. Database & Role Enum Setup

- **Schema Update (`users.schema.ts`)**:
  - Criar um `pgEnum` chamado `user_role` com os valores `['ADMIN', 'USER']`.
  - Adicionar o campo `role` à tabela `users` usando esse enum.
  - **Importante**: Definir `.default('USER')` e `.notNull()` diretamente no schema do banco de dados.
- **Refresh Token Table**: Criar `src/database/schema/refresh-tokens.schema.ts` para persistência de hashes de tokens.

### 2. Guard & Decorator Logic

- Criar `src/modules/auth/decorators/roles.decorator.ts`.
- Criar `src/modules/auth/guards/roles.guard.ts` para validar se o usuário no JWT possui a role necessária para a rota.

### 3. Service Logic & Registration

- **AuthService (`register`)**:
  - Receber `name`, `email` e `password`.
  - Gerar hash da senha com Bcrypt.
  - **Regra de Negócio**: Ao chamar o repository para criar o usuário, garantir que o valor enviado para a coluna `role` seja explicitamente 'USER' ou deixe o banco de dados aplicar o default.
- **AuthService (`login/refresh`)**: Implementar rotação de tokens e validação de credenciais.

### 4. Controller Integration

- Implementar as rotas: `POST /auth/register`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`, `GET /auth/me`.
- Proteger a rota `/auth/me` com o `JwtAuthGuard`.

### 5. Testing & Validation

- **Unit**: Validar que o `AuthService` não permite a passagem de uma role diferente de 'USER' no ato do registro público.
- **Integration**: Registrar um usuário e verificar no banco se a role foi salva como 'USER'.

## Code Specifications

- **Bcrypt**: Salt rounds = 10.
- **Schema Reference**:
  ```typescript
  export const userRoleEnum = pgEnum('user_role', ['ADMIN', 'USER'])
  // ... no pgTable
  role: userRoleEnum('role').default('USER').notNull(),
  ```
