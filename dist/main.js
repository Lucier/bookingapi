"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const node_path_1 = require("node:path");
const node_dns_1 = require("node:dns");
(0, node_dns_1.setDefaultResultOrder)('ipv4first');
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const postgres_js_1 = require("drizzle-orm/postgres-js");
const migrator_1 = require("drizzle-orm/postgres-js/migrator");
const nestjs_zod_1 = require("nestjs-zod");
const postgres = require("postgres");
const app_module_1 = require("./app.module");
const zod_validation_pipe_1 = require("./common/pipes/zod-validation.pipe");
async function runMigrations() {
    const postgresClient = postgres.default || postgres;
    const isLocal = process.env.DATABASE_URL?.includes('localhost');
    let connectionString = process.env.DATABASE_URL;
    if (!isLocal) {
        const url = new URL(connectionString);
        const ipv4 = await new Promise((res) => (0, node_dns_1.resolve4)(url.hostname, (err, addrs) => res(err ? null : (addrs[0] ?? null))));
        if (ipv4) {
            url.hostname = ipv4;
            connectionString = url.toString();
        }
    }
    const client = postgresClient(connectionString, {
        ssl: isLocal ? false : 'require',
        prepare: false,
        max: 1,
    });
    await (0, migrator_1.migrate)((0, postgres_js_1.drizzle)(client), { migrationsFolder: (0, node_path_1.join)(__dirname, 'drizzle') });
    await client.end();
}
async function bootstrap() {
    await runMigrations();
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