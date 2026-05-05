# Role: NestJS & TypeScript Expert

## Objective

Implementar a validação de dados utilizando **Zod** (via `nestjs-zod`). A configuração deve ser centralizada e os Pipes personalizados devem ser alocados em um diretório específico de utilitários comuns.

## Tech Stack

- **Library**: `zod`, `nestjs-zod`.
- **Style**: SEM ponto e vírgula (`semi: false`), aspas SIMPLES (`singleQuote: true`).

## Task Sequence

1. **Dependencies**:
   - Instale `zod` e `nestjs-zod`.
2. **Directory Creation**:
   - Criar a pasta `src/common/pipes`.
3. **Pipe Implementation**:
   - Mover ou configurar o `ZodValidationPipe` para residir em `src/common/pipes/zod-validation.pipe.ts`.
   - Caso o `nestjs-zod` já forneça o pipe pronto, crie um arquivo nessa pasta que o exporte ou que estenda sua funcionalidade para permitir customização de mensagens de erro futuras.
4. **Global Configuration**:
   - No arquivo `src/main.ts`, importar o pipe de `src/common/pipes` e configurá-lo como o `useGlobalPipes` principal.
   - Desativar/Remover o `ValidationPipe` do `class-validator` para evitar redundância.
5. **DTO Pattern**:
   - Criar um exemplo de DTO em `src/common/dto/base.dto.ts` utilizando `createZodDto` para servir de referência para os módulos.

## Code Specifications

- **Semicolons**: Proibido (`false`).
- **Quotes**: Single (`true`).
- Garantir que o path alias (se existir) ou os imports relativos apontem corretamente para `src/common/pipes`.

## Validation

- O Claude deve confirmar que o `main.ts` está utilizando o pipe que reside no novo caminho especificado.
