import { Module } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DatabaseModule } from './database/database.module'
import { UsersModule } from './modules/users/users.module'
import { AuthModule } from './modules/auth/auth.module'
import { SpacesModule } from './modules/spaces/spaces.module'
import { MovingModule } from './modules/moving/moving.module'
import { SchedulingModule } from './modules/scheduling/scheduling.module'
import { EquipmentsModule } from './modules/equipments/equipments.module'
import { ZodSerializerInterceptor } from 'nestjs-zod'

@Module({
  imports: [DatabaseModule, UsersModule, AuthModule, SpacesModule, MovingModule, SchedulingModule, EquipmentsModule],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
  ],
})
export class AppModule {}
