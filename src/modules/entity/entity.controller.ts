import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    UseGuards,
    Request,
  } from '@nestjs/common';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { Roles } from '../auth/decorators/roles.decorator';
  import { EntityService } from './entity.service';
  import { CreateEntityDto } from './dto/create-entity.dto';
  import { UpdateEntityDto } from './dto/update-entity.dto';
  
  @Controller('entities')
  @UseGuards(JwtAuthGuard, RolesGuard)
  export class EntityController {
    constructor(private readonly entityService: EntityService) {}
  
    @Post()
    @Roles('SUPER_ADMIN')
    async create(@Body() createEntityDto: CreateEntityDto) {
      return this.entityService.create(createEntityDto);
    }
  
    @Get()
    @Roles('SUPER_ADMIN')
    async findAll() {
      return this.entityService.findAll();
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string, @Request() req) {
      return this.entityService.findOne(id, req.user);
    }
  
    @Put(':id')
    async update(
      @Param('id') id: string,
      @Body() updateEntityDto: UpdateEntityDto,
      @Request() req,
    ) {
      return this.entityService.update(id, updateEntityDto, req.user);
    }
  
    @Delete(':id')
    @Roles('SUPER_ADMIN')
    async remove(@Param('id') id: string) {
      return this.entityService.remove(id);
    }
  
    @Put(':id/toggle-status')
    @Roles('SUPER_ADMIN')
    async toggleStatus(@Param('id') id: string) {
      return this.entityService.toggleStatus(id);
    }
  
    @Put(':id/features')
    @Roles('SUPER_ADMIN')
    async updateFeatures(@Param('id') id: string, @Body() features: any) {
      return this.entityService.updateFeatures(id, features);
    }
  }