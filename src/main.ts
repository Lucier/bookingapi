import 'dotenv/config'
import { setDefaultResultOrder, resolve4 } from 'node:dns'
setDefaultResultOrder('ipv4first')
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { cleanupOpenApiDoc } from 'nestjs-zod'
import * as postgres from 'postgres'
import { AppModule } from './app.module'
import { ZodValidationPipe } from './common/pipes/zod-validation.pipe'

async function runMigrations(): Promise<void> {
  const postgresClient = (postgres as any).default || postgres
  const isLocal = process.env.DATABASE_URL?.includes('localhost')
  let connectionString = process.env.DATABASE_URL!

  if (!isLocal) {
    const url = new URL(connectionString)
    const ipv4 = await new Promise<string | null>((res) =>
      resolve4(url.hostname, (err, addrs) => res(err ? null : (addrs[0] ?? null)))
    )
    if (ipv4) {
      url.hostname = ipv4
      connectionString = url.toString()
    }
  }

  const client = postgresClient(connectionString, {
    ssl: isLocal ? false : 'require',
    prepare: false,
    max: 1,
  })
  await migrate(drizzle(client), { migrationsFolder: './drizzle' })
  await client.end()
}

async function bootstrap() {
  await runMigrations()

  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api/v1')

  app.useGlobalPipes(new ZodValidationPipe())

  app.enableCors()

  app.enableShutdownHooks()

  const config = new DocumentBuilder()
    .setTitle('Booking API')
    .setDescription('Documentação oficial da API de reservas')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/v1/docs', app, cleanupOpenApiDoc(document))

  await app.listen(process.env.PORT || 3000, '0.0.0.0')
}
bootstrap()
