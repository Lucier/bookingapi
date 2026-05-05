"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = setup;
const dotenv_1 = require("dotenv");
const postgres_js_1 = require("drizzle-orm/postgres-js");
const migrator_1 = require("drizzle-orm/postgres-js/migrator");
const postgres_1 = require("postgres");
(0, dotenv_1.config)({ path: '.env.test', override: true });
async function setup() {
    const client = (0, postgres_1.default)(process.env.DATABASE_URL, { max: 1 });
    const db = (0, postgres_js_1.drizzle)(client);
    await (0, migrator_1.migrate)(db, { migrationsFolder: './drizzle' });
    await client.end();
}
//# sourceMappingURL=global-setup-e2e.js.map