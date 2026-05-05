import { EquipmentsRepository } from '../repositories/equipments.repository';
import { CreateEquipmentDto, UpdateEquipmentDto } from '../dto/equipments.dto';
import { equipments } from '../../../database/schema/index';
type EquipmentRow = typeof equipments.$inferSelect;
export declare class EquipmentsService {
    private readonly equipmentsRepository;
    constructor(equipmentsRepository: EquipmentsRepository);
    create(dto: CreateEquipmentDto): Promise<EquipmentRow>;
    findAll(): Promise<EquipmentRow[]>;
    findOne(id: string): Promise<EquipmentRow>;
    update(id: string, dto: UpdateEquipmentDto): Promise<EquipmentRow>;
    remove(id: string): Promise<void>;
}
export {};
