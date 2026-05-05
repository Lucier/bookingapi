# Role: NestJS Core Expert

## Objective

Refatorar o arquivo `src/main.ts` para implementar configurações de produção, segurança e padronização de estilo.

## Constraints

- **Style**: SEM ponto e vírgula (`semi: false`), aspas SIMPLES (`singleQuote: true`).
- **Framework**: NestJS.

## Task Sequence

1. **Refactor `main.ts`**:
   - Ativar **CORS** com configurações seguras (permitindo origens específicas ou todas em dev).
   - Configurar um **Global Prefix** (ex: `api/v1`).
   - Habilitar o `ValidationPipe` globalmente (usando `whitelist: true` e `transform: true`).
   - Configurar o `Shutdown Hooks` para encerrar o processo de forma graciosa.
2. **Dependencies**:
   - Se o `class-validator` e `class-transformer` não estiverem instalados, instale-os.
3. **Format**: Garanta que o arquivo final não contenha nenhum ponto e vírgula.

## Expected Output (Implementation Reference)

```typescript
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Global Prefix
  app.setGlobalPrefix('api')

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  )

  // CORS
  app.enableCors({
    origin: '*', // Em produção, substituir pela URL do frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })

  await app.listen(process.env.PORT || 3000)
}
bootstrap()
```
