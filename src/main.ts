import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { cleanupOpenApiDoc } from 'nestjs-zod'
import { AppModule } from './app.module'
import { ZodValidationPipe } from './common/pipes/zod-validation.pipe'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api/v1')

  app.useGlobalPipes(new ZodValidationPipe())

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })

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
