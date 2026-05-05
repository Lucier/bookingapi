import { Injectable, NotFoundException } from '@nestjs/common'
import { UsersRepository } from '../repositories/users.repository'
import { UpdateUserDto } from '../dto/users.dto'
import { users } from '../../../database/schema/index'

type UserRow = typeof users.$inferSelect
type UserResponse = Omit<UserRow, 'passwordHash'>

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findAll(): Promise<UserResponse[]> {
    const rows = await this.usersRepository.findAll()
    return rows.map((row) => this.toResponse(row))
  }

  async findOne(id: string): Promise<UserResponse> {
    const user = await this.usersRepository.findById(id)
    if (!user) throw new NotFoundException(`User ${id} not found`)
    return this.toResponse(user)
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserResponse> {
    await this.findOne(id)
    const updated = await this.usersRepository.update(id, dto)
    if (!updated) throw new NotFoundException(`User ${id} not found`)
    return this.toResponse(updated)
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id)
    await this.usersRepository.delete(id)
  }

  private toResponse(user: UserRow): UserResponse {
    const { passwordHash: _omit, ...rest } = user
    return rest
  }
}
