import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common'
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger'
import { ZodSerializerDto } from 'nestjs-zod'
import { MovingService } from '../services/moving.service'
import { CreateMovementDto, UpdateMovementDto, MovementResponseDto } from '../dto/moving.dto'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../../auth/guards/roles.guard'
import { Roles } from '../../auth/decorators/roles.decorator'
import { CurrentUser } from '../../auth/decorators/current-user.decorator'
import type { JwtPayload } from '../../auth/strategies/jwt.strategy'

@ApiTags('Moving')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('moving')
export class MovingController {
  constructor(private readonly movingService: MovingService) {}

  @Post()
  @ApiOperation({ summary: 'Register an equipment movement' })
  @ApiCreatedResponse({ type: MovementResponseDto })
  @ZodSerializerDto(MovementResponseDto)
  create(@Body() dto: CreateMovementDto, @CurrentUser() user: JwtPayload) {
    return this.movingService.create(dto, user.sub)
  }

  @Get()
  @ApiOperation({ summary: 'List all movements' })
  @ApiOkResponse({ type: MovementResponseDto, isArray: true })
  @ZodSerializerDto([MovementResponseDto])
  findAll() {
    return this.movingService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a movement by ID' })
  @ApiOkResponse({ type: MovementResponseDto })
  @ApiNotFoundResponse({ description: 'Movement not found' })
  @ZodSerializerDto(MovementResponseDto)
  findOne(@Param('id') id: string) {
    return this.movingService.findOne(id)
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Correct a movement log (admin only)' })
  @ApiOkResponse({ type: MovementResponseDto })
  @ApiNotFoundResponse({ description: 'Movement not found' })
  @ZodSerializerDto(MovementResponseDto)
  update(@Param('id') id: string, @Body() dto: UpdateMovementDto) {
    return this.movingService.update(id, dto)
  }

  @Delete(':id')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a movement log (admin only)' })
  @ApiNoContentResponse({ description: 'Movement deleted' })
  @ApiNotFoundResponse({ description: 'Movement not found' })
  remove(@Param('id') id: string) {
    return this.movingService.remove(id)
  }
}
