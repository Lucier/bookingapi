import { Module } from '@nestjs/common'
import { DatabaseModule } from '../../database/database.module'
import { AuthModule } from '../auth/auth.module'
import { MovingController } from './controllers/moving.controller'
import { MovingService } from './services/moving.service'
import { MovingRepository } from './repositories/moving.repository'

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [MovingController],
  providers: [MovingService, MovingRepository],
  exports: [MovingService, MovingRepository],
})
export class MovingModule {}
