import { MovingService } from '../services/moving.service';
import { CreateMovementDto, UpdateMovementDto } from '../dto/moving.dto';
import type { JwtPayload } from '../../auth/strategies/jwt.strategy';
export declare class MovingController {
    private readonly movingService;
    constructor(movingService: MovingService);
    create(dto: CreateMovementDto, user: JwtPayload): Promise<import("../repositories/moving.repository").MovementWithDetails>;
    findAll(): Promise<import("../repositories/moving.repository").MovementWithDetails[]>;
    findOne(id: string): Promise<import("../repositories/moving.repository").MovementWithDetails>;
    update(id: string, dto: UpdateMovementDto): Promise<import("../repositories/moving.repository").MovementWithDetails>;
    remove(id: string): Promise<void>;
}
