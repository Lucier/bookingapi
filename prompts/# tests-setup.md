# Role: Senior QA & Backend Engineer

## Objective

Configurar o ecossistema de testes utilizando **Vitest** em um projeto NestJS, substituindo o Jest completamente. O foco é performance e compatibilidade com TypeScript/SWC.

## Tech Stack

- **Test Runner**: Vitest (Última versão).
- **Mocking/Providers**: `@vitest/spy`, `@vitest/utils`.
- **Integration**: `supertest` para testes de API.
- **Rules**: Manter o estilo SEM ponto e vírgula e com aspas SIMPLES.

## Task Sequence

1.  **Dependencies**:
    - Remova as dependências do Jest (`jest`, `@types/jest`, `ts-jest`).
    - Instale as dependências do Vitest: `vitest`, `@vitest/coverage-v8`, `unplugin-swc` (para compatibilidade com NestJS).
2.  **Configuration**:
    - Crie o arquivo `vitest.config.ts` na raiz do projeto.
    - Configure o `provider: 'v8'` para cobertura de testes.
    - Ative os `globals: true` para evitar importar `describe`, `it`, `expect` em cada arquivo.
3.  **Integration Setup**:
    - Crie um arquivo `vitest.config.e2e.ts` (ou adicione um workspace) para testes de integração.
    - Configure o ambiente para carregar o módulo do NestJS e simular requisições HTTP via `supertest`.
4.  **Scripts**:
    - Atualize o `package.json` com os scripts:
      - `"test": "vitest"`
      - `"test:ui": "vitest --ui"`
      - `"test:cov": "vitest run --coverage"`
      - `"test:e2e": "vitest run --config ./vitest.config.e2e.ts"`
5.  **Refactor Boilerplate**:
    - Ajuste os arquivos de teste padrão (`.spec.ts`) criados pelo NestJS para garantir que funcionem com a sintaxe do Vitest (removendo ";" e garantindo aspas simples).

## File Templates

### vitest.config.ts (Base)

```typescript
import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    root: './',
    include: ['src/**/*.spec.ts'],
    setupFiles: [],
    plugins: [
      swc.vite({
        module: { type: 'es6' },
      }),
    ],
  },
})
```
