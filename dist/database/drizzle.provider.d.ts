import * as schema from './schema/index';
export declare const DRIZZLE: unique symbol;
export declare const drizzleProvider: {
    provide: symbol;
    useFactory: () => Promise<import("drizzle-orm/postgres-js").PostgresJsDatabase<typeof schema> & {
        $client: any;
    }>;
};
