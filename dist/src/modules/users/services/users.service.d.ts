import { UsersRepository } from '../repositories/users.repository';
import { UpdateUserDto } from '../dto/users.dto';
import { users } from '../../../database/schema/index';
type UserRow = typeof users.$inferSelect;
type UserResponse = Omit<UserRow, 'passwordHash'>;
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: UsersRepository);
    findAll(): Promise<UserResponse[]>;
    findOne(id: string): Promise<UserResponse>;
    update(id: string, dto: UpdateUserDto): Promise<UserResponse>;
    remove(id: string): Promise<void>;
    private toResponse;
}
export {};
