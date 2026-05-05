import {
  Controller,
  Get,
  Post,
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
  ApiConflictResponse,
} from '@nestjs/swagger'
import { ZodSerializerDto } from 'nestjs-zod'
import { SchedulingService } from '../services/scheduling.service'
import {
  CreateSchedulingDto,
  SchedulingResponseDto,
} from '../dto/scheduling.dto'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../../auth/decorators/current-user.decorator'
import type { JwtPayload } from '../../auth/strategies/jwt.strategy'

@ApiTags('Scheduling')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('scheduling')
export class SchedulingController {
  constructor(private readonly schedulingService: SchedulingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a scheduling' })
  @ApiCreatedResponse({ type: SchedulingResponseDto })
  @ApiConflictResponse({
    description: 'Time slot conflicts with an existing booking',
  })
  @ZodSerializerDto(SchedulingResponseDto)
  create(
    @Body() dto: CreateSchedulingDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.schedulingService.create(dto, user.sub)
  }

  @Get()
  @ApiOperation({ summary: 'List all schedulings' })
  @ApiOkResponse({ type: SchedulingResponseDto, isArray: true })
  @ZodSerializerDto([SchedulingResponseDto])
  findAll() {
    return this.schedulingService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get scheduling by ID' })
  @ApiOkResponse({ type: SchedulingResponseDto })
  @ApiNotFoundResponse({ description: 'Scheduling not found' })
  @ZodSerializerDto(SchedulingResponseDto)
  findOne(@Param('id') id: string) {
    return this.schedulingService.findOne(id)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a scheduling' })
  @ApiNoContentResponse({ description: 'Scheduling deleted' })
  @ApiNotFoundResponse({ description: 'Scheduling not found' })
  remove(@Param('id') id: string) {
    return this.schedulingService.remove(id)
  }
}
