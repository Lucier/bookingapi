# Role: Project Documentation Architect

## Objective

Criar um arquivo central de documentação chamado `CLAUDE.md` na raiz do projeto. Este arquivo servirá como a "Fonte da Verdade" para o contexto do projeto em futuras sessões do Claude Code.

## Task Sequence

1. **Gather Context**: Analise os arquivos de configuração atuais (`package.json`, `drizzle.config.ts`, `vitest.config.ts`, `docker-compose.yml`, `src/main.ts`).
2. **Generate `claude.md`**: Crie o arquivo com as seguintes seções:
   - **Project Overview**: API NestJS para o sistema de Booking.
   - **Tech Stack**: Node.js LTS, NestJS, Drizzle ORM (PostgreSQL), Vitest, Docker.
   - **Strict Code Style**:
     - Aspas simples (`' '`).
     - Sem ponto e vírgula (`no-semi`).
     - Indentação de 2 espaços.
   - **Infrastructure Details**:
     - Banco de Dados: PostgreSQL (User/DB/Pass: booking).
     - Documentação: Swagger disponível em `/docs`.
     - Testes: Vitest com suporte a Globals.
   - **Directories**: Descrição breve da estrutura de pastas (`src/database`, `src/modules`, etc).
3. **Persist Rules**: Adicione uma seção de "Regras de Ouro" no `claude.md` instruindo o Claude a nunca usar ponto e vírgula e sempre manter a tipagem forte do TypeScript.

## Formatting

O arquivo gerado deve ser limpo, organizado com headers Markdown e fácil de ler para uma IA.

## Validation

Confirme se o arquivo `claude.md` foi criado na raiz e se reflete fielmente as configurações que implementamos.
