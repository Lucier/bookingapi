import { Module } from '@nestjs/common'
import { DatabaseModule } from '../../database/database.module'
import { AuthModule } from '../auth/auth.module'
import { SpacesModule } from '../spaces/spaces.module'
import { SchedulingController } from './controllers/scheduling.controller'
import { SchedulingService } from './services/scheduling.service'
import { SchedulingRepository } from './repositories/scheduling.repository'

@Module({
  imports: [DatabaseModule, AuthModule, SpacesModule],
  controllers: [SchedulingController],
  providers: [SchedulingService, SchedulingRepository],
  exports: [SchedulingService, SchedulingRepository],
})
export class SchedulingModule {}
