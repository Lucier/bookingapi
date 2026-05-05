# Role: DevOps & Database Architect

## Objective

Configurar um ambiente de banco de dados isolado para a execução de testes automatizados, garantindo que o banco de desenvolvimento permaneça intacto.

## Task Sequence

### 1. Docker Compose Update

- **File**: `docker-compose.yml`
- **Action**: Adicionar um novo serviço chamado `test_db` ou configurar um script de inicialização para criar dois bancos de dados (`booking` e `booking_test`) no mesmo container.
- **Preferência**: Criar um segundo banco no mesmo container para economizar recursos.
  - Adicionar um arquivo `init-test-db.sql` na pasta `./docker-init` com o comando:
    `CREATE DATABASE booking_test;`
  - Mapear esse arquivo no volume do postgres: `./docker-init:/docker-entrypoint-initdb.d`

### 2. Environment Configuration

- **File**: `.env.test`
- **Action**: Criar este arquivo com as mesmas variáveis do `.env`, mas apontando para `booking_test`.
- **Variables**:
  - `DATABASE_URL=postgres://booking:booking@localhost:5432/booking_test`
  - `NODE_ENV=test`

### 3. Test Database Provider

- **File**: `src/database/database.module.ts` (ou onde o Drizzle é instanciado).
- **Action**: Garantir que o NestJS consiga ler o `.env.test` quando os testes forem disparados via Vitest.

### 4. Vitest Integration

- **File**: `vitest.config.ts` ou `test/vitest-setup.ts`.
- **Action**:
  - Configurar um `globalSetup` para rodar as migrations do Drizzle no banco de teste antes dos testes começarem.
  - Garantir que após os testes, a conexão seja encerrada.

## Code Style

- SEM ponto e vírgula.
- Aspas SIMPLES.

## Validation

- O Claude deve rodar `docker compose up -d` para aplicar as mudanças.
- Tentar conectar no banco `booking_test` manualmente para confirmar a existência.
- Rodar `npm run test:e2e` e verificar se ele utiliza o banco correto.
