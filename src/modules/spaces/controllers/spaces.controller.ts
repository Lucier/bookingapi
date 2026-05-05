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
import { SpacesService } from '../services/spaces.service'
import { CreateSpaceDto, UpdateSpaceDto, SpaceResponseDto } from '../dto/spaces.dto'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../../auth/guards/roles.guard'
import { Roles } from '../../auth/decorators/roles.decorator'

@ApiTags('Spaces')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('spaces')
export class SpacesController {
  constructor(private readonly spacesService: SpacesService) {}

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create a space' })
  @ApiCreatedResponse({ type: SpaceResponseDto })
  @ZodSerializerDto(SpaceResponseDto)
  create(@Body() dto: CreateSpaceDto) {
    return this.spacesService.create(dto)
  }

  @Get()
  @ApiOperation({ summary: 'List all spaces' })
  @ApiOkResponse({ type: SpaceResponseDto, isArray: true })
  @ZodSerializerDto([SpaceResponseDto])
  findAll() {
    return this.spacesService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a space by ID' })
  @ApiOkResponse({ type: SpaceResponseDto })
  @ApiNotFoundResponse({ description: 'Space not found' })
  @ZodSerializerDto(SpaceResponseDto)
  findOne(@Param('id') id: string) {
    return this.spacesService.findOne(id)
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Update a space' })
  @ApiOkResponse({ type: SpaceResponseDto })
  @ApiNotFoundResponse({ description: 'Space not found' })
  @ZodSerializerDto(SpaceResponseDto)
  update(@Param('id') id: string, @Body() dto: UpdateSpaceDto) {
    return this.spacesService.update(id, dto)
  }

  @Delete(':id')
  @Roles('ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a space' })
  @ApiNoContentResponse({ description: 'Space deleted' })
  @ApiNotFoundResponse({ description: 'Space not found' })
  remove(@Param('id') id: string) {
    return this.spacesService.remove(id)
  }
}
