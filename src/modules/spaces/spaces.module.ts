import { Module } from '@nestjs/common'
import { DatabaseModule } from '../../database/database.module'
import { AuthModule } from '../auth/auth.module'
import { SpacesController } from './controllers/spaces.controller'
import { SpacesService } from './services/spaces.service'
import { SpacesRepository } from './repositories/spaces.repository'

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [SpacesController],
  providers: [SpacesService, SpacesRepository],
  exports: [SpacesService, SpacesRepository],
})
export class SpacesModule {}
