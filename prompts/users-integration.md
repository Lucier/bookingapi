# Role: NestJS Integration Specialist

## Objective

Finalizar o módulo de usuários integrando a documentação automática via Swagger (utilizando a tipagem automática do Zod), validações rigorosas e testes E2E.

## Task Sequence

### 1. Advanced Swagger & Zod Integration

- **Files**: `src/modules/users/dto/users.dto.ts` e `src/modules/users/controllers/users.controller.ts`.
- **Dica de Ouro (Automation)**:
  - No `users.dto.ts`, utilize `createZodDto` para transformar o schema Zod em uma classe que o NestJS e o Swagger entendam nativamente.
  - Isso garante que campos como `email()` ou `min(3)` no Zod apareçam automaticamente na UI do Swagger sem decorators extras.
- **Controller Setup**:
  - Adicionar `@ApiTags('Users')` à classe.
  - Adicionar `@ApiOperation()` para descrever cada rota.
  - Garantir que o retorno das rotas use os DTOs de resposta para correta tipagem na documentação.

### 2. E2E Test Construction

- **File**: `test/users.e2e-spec.ts`.
- **Action**: Implementar testes de fluxo real (request/response).
- **Cenários**:
  - Listagem de usuários.
  - Busca por ID (sucesso e erro 404).
  - Atualização parcial (Patch) validando se o Zod bloqueia tipos inválidos.
  - Deleção de usuário.

### 3. Cleanup & Logic

- Implementar a limpeza de dados entre os testes para garantir idempotência.

## Code Style Constraints

- SEM ponto e vírgula (`semi: false`).
- Aspas SIMPLES (`singleQuote: true`).
- Usar `snake_case` nos nomes das propriedades do banco e `camelCase` no DTO.

## Validation

- O Claude deve confirmar que, ao acessar `/docs`, os modelos (Schemas) de entrada e saída estão visíveis e detalhados.
- Executar `npm run test:e2e` e reportar o sucesso.
