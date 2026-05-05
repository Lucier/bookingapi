import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as dbSchema from '../../../database/schema/index';
import { equipments } from '../../../database/schema/index';
type DrizzleDB = PostgresJsDatabase<typeof dbSchema>;
type EquipmentRow = typeof equipments.$inferSelect;
type EquipmentInsertData = Pick<typeof equipments.$inferInsert, 'name' | 'description' | 'manufacturer' | 'model' | 'serialNumber' | 'category' | 'conservationStatus' | 'spaceId'>;
type EquipmentUpdateData = Partial<EquipmentInsertData>;
export declare class EquipmentsRepository {
    private readonly db;
    constructor(db: DrizzleDB);
    create(data: EquipmentInsertData): Promise<EquipmentRow>;
    findAll(): Promise<EquipmentRow[]>;
    findById(id: string): Promise<EquipmentRow | undefined>;
    update(id: string, data: EquipmentUpdateData): Promise<EquipmentRow | undefined>;
    delete(id: string): Promise<void>;
}
export {};
