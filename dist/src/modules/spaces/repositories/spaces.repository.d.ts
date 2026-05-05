import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as dbSchema from '../../../database/schema/index';
import { spaces } from '../../../database/schema/index';
type DrizzleDB = PostgresJsDatabase<typeof dbSchema>;
type SpaceRow = typeof spaces.$inferSelect;
type SpaceInsertData = Pick<typeof spaces.$inferInsert, 'name' | 'description' | 'status'>;
type SpaceUpdateData = Partial<SpaceInsertData>;
export declare class SpacesRepository {
    private readonly db;
    constructor(db: DrizzleDB);
    create(data: SpaceInsertData): Promise<SpaceRow>;
    findAll(): Promise<SpaceRow[]>;
    findById(id: string): Promise<SpaceRow | undefined>;
    update(id: string, data: SpaceUpdateData): Promise<SpaceRow | undefined>;
    delete(id: string): Promise<void>;
}
export {};
