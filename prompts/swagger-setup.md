# Role: NestJS Architecture Expert

## Objective

Configurar a documentação automática da API utilizando **Swagger (OpenAPI)**. A documentação deve ser acessível, organizada e seguir os padrões de estilo do projeto.

## Tech Stack

- **Library**: `@nestjs/swagger`, `swagger-ui-express`.
- **Style**: SEM ponto e vírgula (`semi: false`), aspas SIMPLES (`singleQuote: true`).

## Task Sequence

1. **Dependencies**:
   - Instale `@nestjs/swagger` e `swagger-ui-express`.
2. **Refactor `src/main.ts`**:
   - Importar `DocumentBuilder` e `SwaggerModule`.
   - Configurar o Swagger para rodar no caminho `/docs`.
   - Adicionar Título, Descrição e Versão da API (use "Booking API" como título).
   - Configurar o `SwaggerModule` para criar o documento e montar a interface.
3. **DTO Integration**:
   - Se houver DTOs existentes, adicione o `@ApiProperty()` básico ou instrua o uso do plugin do Swagger no `nest-cli.json` para geração automática.
4. **Format**: Certifique-se de que o código adicionado ao `main.ts` não possua pontos e vírgulas.

## Expected Code Snippet (Reference)

```typescript
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

// ... dentro do bootstrap()
const config = new DocumentBuilder()
  .setTitle('Booking API')
  .setDescription('Documentação oficial da API de reservas')
  .setVersion('1.0')
  .addBearerAuth()
  .build()

const document = SwaggerModule.createDocument(app, config)
SwaggerModule.setup('docs', app, document)
```
