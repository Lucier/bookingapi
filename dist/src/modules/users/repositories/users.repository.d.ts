import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as dbSchema from '../../../database/schema/index';
import { users } from '../../../database/schema/index';
type DrizzleDB = PostgresJsDatabase<typeof dbSchema>;
type UserUpdateData = Partial<Pick<typeof users.$inferInsert, 'name' | 'email'>>;
export declare class UsersRepository {
    private readonly db;
    constructor(db: DrizzleDB);
    findAll(): Promise<(typeof users.$inferSelect)[]>;
    findById(id: string): Promise<typeof users.$inferSelect | undefined>;
    update(id: string, data: UserUpdateData): Promise<typeof users.$inferSelect | undefined>;
    delete(id: string): Promise<void>;
}
export {};
