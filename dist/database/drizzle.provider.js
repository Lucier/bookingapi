"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.drizzleProvider = exports.DRIZZLE = void 0;
const node_dns_1 = require("node:dns");
const postgres_js_1 = require("drizzle-orm/postgres-js");
const postgres = require("postgres");
const schema = require("./schema/index");
exports.DRIZZLE = Symbol('DRIZZLE');
async function resolveIPv4(hostname) {
    return new Promise((resolve) => (0, node_dns_1.resolve4)(hostname, (err, addrs) => resolve(err ? null : (addrs[0] ?? null))));
}
exports.drizzleProvider = {
    provide: exports.DRIZZLE,
    useFactory: async () => {
        const postgresClient = postgres.default || postgres;
        const isLocal = process.env.DATABASE_URL?.includes('localhost');
        let connectionString = process.env.DATABASE_URL;
        console.log('[DB] Connecting to:', connectionString.replace(/:([^@]+)@/, ':***@'));
        if (!isLocal) {
            const url = new URL(connectionString);
            const ipv4 = await resolveIPv4(url.hostname);
            console.log('[DB] Resolved IPv4:', ipv4);
            if (ipv4) {
                url.hostname = ipv4;
                connectionString = url.toString();
                console.log('[DB] Final URL:', connectionString.replace(/:([^@]+)@/, ':***@'));
            }
        }
        const client = postgresClient(connectionString, {
            ssl: isLocal ? false : 'require',
            prepare: isLocal ? undefined : false,
        });
        return (0, postgres_js_1.drizzle)(client, { schema });
    },
};
//# sourceMappingURL=drizzle.provider.js.map