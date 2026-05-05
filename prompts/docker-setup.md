# Role: DevOps & Infrastructure Engineer

## Objective

Configurar a containerização do projeto utilizando Docker e Docker Compose, garantindo a persistência do banco de dados PostgreSQL e a conectividade com a API NestJS.

## Database Specifications

- **Engine**: PostgreSQL (imagem: `postgres:15-alpine`)
- **User**: booking
- **Password**: booking
- **DB Name**: booking
- **Internal Port**: 5432

## Task Sequence

1. **Generate Dockerfile**:
   - Criar um `Dockerfile` multi-stage (build e run) otimizado para Node.js.
   - Stage 1 (Build): Instalar dependências e rodar `npm run build`.
   - Stage 2 (Runtime): Copiar apenas o necessário da `dist` e `node_modules` de produção.
2. **Generate docker-compose.yml**:
   - Criar um serviço `db` usando a imagem do PostgreSQL com as credenciais acima.
   - Configurar um volume persistente para os dados do banco.
   - Criar um serviço `api` que depende do `db`.
   - Mapear a porta 3000 da aplicação para a porta 3000 do host.
3. **Update .env**:
   - Criar ou atualizar o arquivo `.env` na raiz.
   - Adicionar `DATABASE_URL="postgresql://booking:booking@db:5432/booking?schema=public"`.
   - Garantir que a `PORT=3000` esteja definida.
4. **Generate .dockerignore**:
   - Incluir `node_modules`, `dist`, `.git`, e `npm-debug.log`.

## Constraints

- Usar redes internas no Docker Compose para que a API se comunique com o banco usando o hostname `db`.
- Garantir que a API aguarde o banco de dados estar pronto (healthcheck ou restart policy).

## Validation

- O Claude deve confirmar se o arquivo `.env` foi atualizado corretamente sem apagar chaves existentes.
