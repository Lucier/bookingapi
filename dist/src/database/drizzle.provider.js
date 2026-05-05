"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drizzleProvider = exports.DRIZZLE = void 0;
const postgres_js_1 = require("drizzle-orm/postgres-js");
const postgres = require("postgres");
const schema = require("./schema/index");
exports.DRIZZLE = Symbol('DRIZZLE');
exports.drizzleProvider = {
    provide: exports.DRIZZLE,
    useFactory: () => {
        const postgresClient = postgres.default || postgres;
        const client = postgresClient(process.env.DATABASE_URL);
        return (0, postgres_js_1.drizzle)(client, { schema });
    },
};
//# sourceMappingURL=drizzle.provider.js.map