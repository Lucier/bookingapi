import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as dbSchema from '../../../database/schema/index';
import { movingEquipment } from '../../../database/schema/index';
type DrizzleDB = PostgresJsDatabase<typeof dbSchema>;
type MovementRow = typeof movingEquipment.$inferSelect;
type MovementInsertData = Omit<typeof movingEquipment.$inferInsert, 'id' | 'movementDate' | 'createdAt'>;
type MovementUpdateData = Partial<Pick<typeof movingEquipment.$inferInsert, 'originSpaceId' | 'destinationSpaceId' | 'movementType' | 'description'>>;
export type MovementWithDetails = MovementRow & {
    equipmentName: string | null;
    originSpaceName: string | null;
    destinationSpaceName: string | null;
};
export declare class MovingRepository {
    private readonly db;
    constructor(db: DrizzleDB);
    create(data: MovementInsertData): Promise<MovementRow>;
    findAll(): Promise<MovementWithDetails[]>;
    findById(id: string): Promise<MovementWithDetails | undefined>;
    update(id: string, data: MovementUpdateData): Promise<MovementRow | undefined>;
    delete(id: string): Promise<void>;
    equipmentExists(equipmentId: string): Promise<boolean>;
}
export {};
