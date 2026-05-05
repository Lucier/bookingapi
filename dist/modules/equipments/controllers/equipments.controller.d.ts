import { EquipmentsService } from '../services/equipments.service';
import { CreateEquipmentDto, UpdateEquipmentDto } from '../dto/equipments.dto';
export declare class EquipmentsController {
    private readonly equipmentsService;
    constructor(equipmentsService: EquipmentsService);
    create(dto: CreateEquipmentDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        manufacturer: string;
        model: string;
        serialNumber: string;
        category: string;
        conservationStatus: "maintenance" | "new" | "good" | "regular" | "downloaded";
        spaceId: string;
    }>;
    findAll(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        manufacturer: string;
        model: string;
        serialNumber: string;
        category: string;
        conservationStatus: "maintenance" | "new" | "good" | "regular" | "downloaded";
        spaceId: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        manufacturer: string;
        model: string;
        serialNumber: string;
        category: string;
        conservationStatus: "maintenance" | "new" | "good" | "regular" | "downloaded";
        spaceId: string;
    }>;
    update(id: string, dto: UpdateEquipmentDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        manufacturer: string;
        model: string;
        serialNumber: string;
        category: string;
        conservationStatus: "maintenance" | "new" | "good" | "regular" | "downloaded";
        spaceId: string;
    }>;
    remove(id: string): Promise<void>;
}
