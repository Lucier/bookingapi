"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const node_dns_1 = require("node:dns");
(0, node_dns_1.setDefaultResultOrder)('ipv4first');
const postgres_js_1 = require("drizzle-orm/postgres-js");
const postgres = require("postgres");
const bcrypt = require("bcrypt");
const schema = require("./schema/index");
async function seed() {
    const postgresClient = postgres.default || postgres;
    const isLocal = process.env.DATABASE_URL?.includes('localhost');
    let connectionString = process.env.DATABASE_URL;
    if (!isLocal) {
        const url = new URL(connectionString);
        const ipv4 = await new Promise((resolve) => (0, node_dns_1.resolve4)(url.hostname, (err, addrs) => resolve(err ? null : (addrs[0] ?? null))));
        if (ipv4) {
            url.hostname = ipv4;
            connectionString = url.toString();
        }
    }
    const client = postgresClient(connectionString, {
        ssl: isLocal ? false : 'require',
    });
    const db = (0, postgres_js_1.drizzle)(client, { schema });
    const passwordHash = await bcrypt.hash('admin123', 10);
    const [user] = await db
        .insert(schema.users)
        .values({
        name: 'Admin',
        email: 'admin@booking.com',
        passwordHash,
        role: 'ADMIN',
    })
        .onConflictDoNothing()
        .returning();
    if (user) {
        console.log(`Admin user created: ${user.email} (id: ${user.id})`);
    }
    else {
        console.log('Admin user already exists, skipped.');
    }
    await client.end();
}
seed().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map