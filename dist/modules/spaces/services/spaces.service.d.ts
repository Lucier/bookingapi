import { SpacesRepository } from '../repositories/spaces.repository';
import { CreateSpaceDto, UpdateSpaceDto } from '../dto/spaces.dto';
import { spaces } from '../../../database/schema/index';
type SpaceRow = typeof spaces.$inferSelect;
export declare class SpacesService {
    private readonly spacesRepository;
    constructor(spacesRepository: SpacesRepository);
    create(dto: CreateSpaceDto): Promise<SpaceRow>;
    findAll(): Promise<SpaceRow[]>;
    findOne(id: string): Promise<SpaceRow>;
    update(id: string, dto: UpdateSpaceDto): Promise<SpaceRow>;
    remove(id: string): Promise<void>;
}
export {};
