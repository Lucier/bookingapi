# Role: NestJS & Backend Architecture Expert

## Objective

Criar o módulo completo de Usuários (`UsersModule`) seguindo a arquitetura de camadas (Controller, Service, Repository) e utilizando Zod para validação.

## Directory Structure

Todos os arquivos devem ser criados em `src/modules/users`:

- `controllers/users.controller.ts`
- `services/users.service.ts`
- `repositories/users.repository.ts`
- `dto/users.dto.ts`
- `validators/users.validator.ts`
- `specs/users.service.spec.ts` (ou `users.controller.spec.ts`)
- `users.module.ts`

## Requirements & Layer Responsibility

1. **Repository**:
   - Injetar a instância do Drizzle (`db`).
   - Implementar métodos de persistência: `findAll`, `findById`, `update`, `delete`.
   - Deve ser a única camada que "fala" com o schema do Drizzle.
2. **Service**:
   - Injetar o `UsersRepository`.
   - Implementar a lógica de negócio para `findAll`, `findOne`, `update` e `remove`.
   - Lançar `NotFoundException` caso o usuário não exista em buscas específicas.
3. **Controller**:
   - Definir as rotas `@Get()`, `@Get(':id')`, `@Patch(':id')` e `@Delete(':id')`.
   - Utilizar os DTOs validados pelo Zod.
4. **Validation (Zod)**:
   - Criar schemas Zod para atualização e resposta.
   - Utilizar `createZodDto` no arquivo `dto/users.dto.ts`.

## Tech Stack & Style

- **Style**: SEM ponto e vírgula, aspas SIMPLES.
- **ORM**: Drizzle ORM.
- **Validation**: `nestjs-zod`.

## Task Sequence

1. Criar a estrutura de pastas em `src/modules/users`.
2. Criar os arquivos de Schema/DTO primeiro para garantir a tipagem.
3. Implementar o Repository.
4. Implementar o Service e Controller.
5. Registrar o `UsersModule` no `AppModule`.

## Validation

- O Claude deve garantir que todas as injeções de dependência estão corretas.
- O código deve compilar sem erros de tipo.
