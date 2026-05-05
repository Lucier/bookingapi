import { SpacesService } from '../services/spaces.service';
import { CreateSpaceDto, UpdateSpaceDto } from '../dto/spaces.dto';
export declare class SpacesController {
    private readonly spacesService;
    constructor(spacesService: SpacesService);
    create(dto: CreateSpaceDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        status: "active" | "maintenance" | "inactive";
    }>;
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        status: "active" | "maintenance" | "inactive";
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        status: "active" | "maintenance" | "inactive";
    }>;
    update(id: string, dto: UpdateSpaceDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
        status: "active" | "maintenance" | "inactive";
    }>;
    remove(id: string): Promise<void>;
}
