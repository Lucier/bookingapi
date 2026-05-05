# Role: Senior Backend Engineer

## Objective

Criar arquivos de testes unitários para o `AppController` e `AppService` utilizando **Vitest**. Os testes devem validar o comportamento padrão ("Hello World") e garantir 100% de cobertura para estes arquivos.

## Strict Style Rules

- **Semicolons**: Proibido o uso de ponto e vírgula (`semi: false`).
- **Quotes**: Utilizar apenas aspas simples (`singleQuote: true`).
- **Globals**: Assumir que `describe`, `it` e `expect` estão disponíveis globalmente (configuração do Vitest).

## Task Sequence

1. **Identify**: Localize os arquivos `src/app.controller.ts` e `src/app.service.ts`.
2. **Generate Controller Test**:
   - Criar o arquivo `src/app.controller.spec.ts`.
   - Utilizar o `TestingModule` do `@nestjs/testing`.
   - Criar um teste que valide se o método `getHello()` retorna a string esperada.
3. **Generate Service Test**:
   - Criar o arquivo `src/app.service.spec.ts`.
   - Criar um teste unitário simples que valide o retorno do método `getHello()`.
4. **Format**: Garanta que ambos os arquivos gerados não possuam pontos e vírgulas.

## File Templates (Reference)

### App Controller Spec

```typescript
import { Test, TestingModule } from '@nestjs/testing'
import { AppController } from './app.controller'
import { AppService } from './app.service'

describe('AppController', () => {
  let appController: AppController

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile()

    appController = app.get<AppController>(AppController)
  })

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!')
    })
  })
})
```
