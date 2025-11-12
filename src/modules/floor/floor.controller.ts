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
  import { FloorService } from './floor.service';
  import { CreateFloorDto } from './dto/create-floor.dto';
  import { UpdateFloorDto } from './dto/update-floor.dto';
  
  @Controller('floors')
  @UseGuards(JwtAuthGuard, RolesGuard)
  export class FloorController {
    constructor(private readonly floorService: FloorService) {}
  
    @Post()
    async create(@Body() createFloorDto: CreateFloorDto, @Request() req) {
      return this.floorService.create(createFloorDto, req.user);
    }
  
    @Get('entity/:entityId')
    async findAll(@Param('entityId') entityId: string) {
      return this.floorService.findAll(entityId);
    }
  
    @Get('building/:buildingId')
    async findByBuilding(@Param('buildingId') buildingId: string) {
      return this.floorService.findByBuilding(buildingId);
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string, @Request() req) {
      return this.floorService.findOne(id, req.user);
    }
  
    @Put(':id')
    async update(
      @Param('id') id: string,
      @Body() updateFloorDto: UpdateFloorDto,
      @Request() req,
    ) {
      return this.floorService.update(id, updateFloorDto, req.user);
    }
  
    @Delete(':id')
    async remove(@Param('id') id: string, @Request() req) {
      return this.floorService.remove(id, req.user);
    }
  }