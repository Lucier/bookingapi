import { MovingRepository, MovementWithDetails } from '../repositories/moving.repository';
import { CreateMovementDto, UpdateMovementDto } from '../dto/moving.dto';
export declare class MovingService {
    private readonly movingRepository;
    constructor(movingRepository: MovingRepository);
    create(dto: CreateMovementDto, userId: string): Promise<MovementWithDetails>;
    findAll(): Promise<MovementWithDetails[]>;
    findOne(id: string): Promise<MovementWithDetails>;
    update(id: string, dto: UpdateMovementDto): Promise<MovementWithDetails>;
    remove(id: string): Promise<void>;
}
