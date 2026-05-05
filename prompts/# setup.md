# Prompt de Geração de Projeto: API NestJS Profissional

Atue como um Engenheiro de Software Sênior especializado em Node.js. O seu objetivo é gerar a estrutura inicial completa de um projeto NestJS seguindo rigorosamente as especificações abaixo.

## 1. Stack Tecnológica

- **Runtime:** Node.js (Versão LTS mais recente).
- **Framework:** NestJS (Versão estável mais recente).
- **Linguagem:** TypeScript.
- **Gerenciador de Pacotes:** NPM.

## 2. Configuração de Estilo e Linting (CRÍTICO)

Configure o ESLint e o Prettier para trabalharem em harmonia. O código gerado DEVE seguir estas regras:

- **Quotes:** Utilizar apenas aspas simples (`singleQuote: true`).
- **Semicolons:** Não utilizar ponto e vírgula ao final das instruções (`semi: false`).
- **Trailing Commas:** Utilizar vírgulas flutuantes em objetos e arrays conforme o padrão ES5.
- **Arrow Parens:** Sempre incluir parênteses em arrow functions (`avoid` ou `always`).
- **Tab Width:** 2 espaços.

## 3. Estrutura de Arquivos Solicitada

Gere os seguintes arquivos de configuração inicial:

- `package.json`: Com todas as dependências do NestJS, scripts de build, start, dev e lint.
- `.eslintrc.js`: Configurado para TypeScript e integrado ao Prettier, reforçando a ausência de ponto e vírgula.
- `.prettierrc`: Contendo as regras de aspas simples e sem ponto e vírgula.
- `tsconfig.json`: Configuração padrão recomendada pelo NestJS.
- `src/main.ts`: Arquivo de entrada configurado.
- `src/app.module.ts`: Módulo raiz.
- `src/app.controller.ts` e `src/app.service.ts`: Exemplo básico de "Hello World" respeitando o estilo sem ponto e vírgula.

## 4. Instruções de Execução

Forneça o comando único para instalar as dependências e o comando para rodar o projeto em modo de desenvolvimento (`npm run start:dev`).

## 5. Requisito de Código

Certifique-se de que TODO o código gerado nos arquivos `.ts` não contenha pontos e vírgulas e utilize aspas simples, para que não haja erros de lint logo após a criação.
