import { EquipmentsService } from '../services/equipments.service';
import { CreateEquipmentDto, UpdateEquipmentDto } from '../dto/equipments.dto';
export declare class EquipmentsController {
    private readonly equipmentsService;
    constructor(equipmentsService: EquipmentsService);
    create(dto: CreateEquipmentDto): Promise<{
        id: string;
        name: string;
        description: string;
        manufacturer: string;
        model: string;
        serialNumber: string;
        category: string;
        conservationStatus: "new" | "good" | "regular" | "maintenance" | "downloaded";
        createdAt: Date;
        updatedAt: Date;
        spaceId: string;
    }>;
    findAll(): Promise<{
        id: string;
        name: string;
        description: string;
        manufacturer: string;
        model: string;
        serialNumber: string;
        category: string;
        conservationStatus: "new" | "good" | "regular" | "maintenance" | "downloaded";
        createdAt: Date;
        updatedAt: Date;
        spaceId: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        description: string;
        manufacturer: string;
        model: string;
        serialNumber: string;
        category: string;
        conservationStatus: "new" | "good" | "regular" | "maintenance" | "downloaded";
        createdAt: Date;
        updatedAt: Date;
        spaceId: string;
    }>;
    update(id: string, dto: UpdateEquipmentDto): Promise<{
        id: string;
        name: string;
        description: string;
        manufacturer: string;
        model: string;
        serialNumber: string;
        category: string;
        conservationStatus: "new" | "good" | "regular" | "maintenance" | "downloaded";
        createdAt: Date;
        updatedAt: Date;
        spaceId: string;
    }>;
    remove(id: string): Promise<void>;
}
