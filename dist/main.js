"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const node_dns_1 = require("node:dns");
(0, node_dns_1.setDefaultResultOrder)('ipv4first');
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const nestjs_zod_1 = require("nestjs-zod");
const app_module_1 = require("./app.module");
const zod_validation_pipe_1 = require("./common/pipes/zod-validation.pipe");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new zod_validation_pipe_1.ZodValidationPipe());
    app.enableCors();
    app.enableShutdownHooks();
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Booking API')
        .setDescription('Documentação oficial da API de reservas')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/v1/docs', app, (0, nestjs_zod_1.cleanupOpenApiDoc)(document));
    await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
//# sourceMappingURL=main.js.map