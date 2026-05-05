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
import { EquipmentsService } from '../services/equipments.service'
import {
  CreateEquipmentDto,
  UpdateEquipmentDto,
  EquipmentResponseDto,
} from '../dto/equipments.dto'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../../auth/guards/roles.guard'
import { Roles } from '../../auth/decorators/roles.decorator'

@ApiTags('Equipments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('equipments')
export class EquipmentsController {
  constructor(private readonly equipmentsService: EquipmentsService) {}

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create an equipment' })
  @ApiCreatedResponse({ type: EquipmentResponseDto })
  @ZodSerializerDto(EquipmentResponseDto)
  create(@Body() dto: CreateEquipmentDto) {
    return this.equipmentsService.create(dto)
  }

  @Get()
  @ApiOperation({ summary: 'List all equipments' })
  @ApiOkResponse({ type: EquipmentResponseDto, isArray: true })
  @ZodSerializerDto([EquipmentResponseDto])
  findAll() {
    return this.equipmentsService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an equipment by ID' })
  @ApiOkResponse({ type: EquipmentResponseDto })
  @ApiNotFoundResponse({ description: 'Equipment not found' })
  @ZodSerializerDto(EquipmentResponseDto)
  findOne(@Param('id') id: string) {
    return this.equipmentsService.findOne(id)
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update an equipment' })
  @ApiOkResponse({ type: EquipmentResponseDto })
  @ApiNotFoundResponse({ description: 'Equipment not found' })
  @ZodSerializerDto(EquipmentResponseDto)
  update(@Param('id') id: string, @Body() dto: UpdateEquipmentDto) {
    return this.equipmentsService.update(id, dto)
  }

  @Delete(':id')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an equipment' })
  @ApiNoContentResponse({ description: 'Equipment deleted' })
  @ApiNotFoundResponse({ description: 'Equipment not found' })
  remove(@Param('id') id: string) {
    return this.equipmentsService.remove(id)
  }
}
