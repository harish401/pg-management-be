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
  import { RoomService } from './room.service';
  import { CreateRoomDto } from './dto/create-room.dto';
  import { UpdateRoomDto } from './dto/update-room.dto';
  
  @Controller('rooms')
  @UseGuards(JwtAuthGuard, RolesGuard)
  export class RoomController {
    constructor(private readonly roomService: RoomService) {}
  
    @Post()
    async create(@Body() createRoomDto: CreateRoomDto, @Request() req) {
      return this.roomService.create(createRoomDto, req.user);
    }
  
    @Get('entity/:entityId')
    async findAll(@Param('entityId') entityId: string) {
      return this.roomService.findAll(entityId);
    }
  
    @Get('floor/:floorId')
    async findByFloor(@Param('floorId') floorId: string) {
      return this.roomService.findByFloor(floorId);
    }
  
    @Get('building/:buildingId')
    async findByBuilding(@Param('buildingId') buildingId: string) {
      return this.roomService.findByBuilding(buildingId);
    }
  
    @Get('stats/:entityId')
    async getOccupancyStats(@Param('entityId') entityId: string) {
      return this.roomService.getOccupancyStats(entityId);
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string, @Request() req) {
      return this.roomService.findOne(id, req.user);
    }
  
    @Put(':id')
    async update(
      @Param('id') id: string,
      @Body() updateRoomDto: UpdateRoomDto,
      @Request() req,
    ) {
      return this.roomService.update(id, updateRoomDto, req.user);
    }
  
    @Put(':id/layout')
    async updateLayout(
      @Param('id') id: string,
      @Body() body: { layout: any },
      @Request() req,
    ) {
      return this.roomService.updateLayout(id, body.layout, req.user);
    }
  
    @Delete(':id')
    async remove(@Param('id') id: string, @Request() req) {
      return this.roomService.remove(id, req.user);
    }
  }