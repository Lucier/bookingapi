import { Module } from '@nestjs/common'
import { DatabaseModule } from '../../database/database.module'
import { AuthModule } from '../auth/auth.module'
import { EquipmentsController } from './controllers/equipments.controller'
import { EquipmentsService } from './services/equipments.service'
import { EquipmentsRepository } from './repositories/equipments.repository'

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [EquipmentsController],
  providers: [EquipmentsService, EquipmentsRepository],
  exports: [EquipmentsService, EquipmentsRepository],
})
export class EquipmentsModule {}
