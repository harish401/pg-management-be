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
  import { BuildingService } from './building.service';
  import { CreateBuildingDto } from './dto/create-building.dto';
  import { UpdateBuildingDto } from './dto/update-building.dto';
  
  @Controller('buildings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  export class BuildingController {
    constructor(private readonly buildingService: BuildingService) {}
  
    @Post()
    async create(@Body() createBuildingDto: CreateBuildingDto, @Request() req) {
      return this.buildingService.create(createBuildingDto, req.user);
    }
  
    @Get('entity/:entityId')
    async findAll(@Param('entityId') entityId: string) {
      return this.buildingService.findAll(entityId);
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string, @Request() req) {
      return this.buildingService.findOne(id, req.user);
    }
  
    @Put(':id')
    async update(
      @Param('id') id: string,
      @Body() updateBuildingDto: UpdateBuildingDto,
      @Request() req,
    ) {
      return this.buildingService.update(id, updateBuildingDto, req.user);
    }
  
    @Delete(':id')
    async remove(@Param('id') id: string, @Request() req) {
      return this.buildingService.remove(id, req.user);
    }
  }