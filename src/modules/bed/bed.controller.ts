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
  import { BedService } from './bed.service';
  import { CreateBedDto } from './dto/create-bed.dto';
  import { UpdateBedDto } from './dto/update-bed.dto';
  
  @Controller('beds')
  @UseGuards(JwtAuthGuard, RolesGuard)
  export class BedController {
    constructor(private readonly bedService: BedService) {}
  
    @Post()
    async create(@Body() createBedDto: CreateBedDto, @Request() req) {
      return this.bedService.create(createBedDto, req.user);
    }
  
    @Get('entity/:entityId')
    async findAll(@Param('entityId') entityId: string) {
      return this.bedService.findAll(entityId);
    }
  
    @Get('room/:roomId')
    async findByRoom(@Param('roomId') roomId: string) {
      return this.bedService.findByRoom(roomId);
    }
  
    @Get('available/:entityId')
    async findAvailable(@Param('entityId') entityId: string) {
      return this.bedService.findAvailable(entityId);
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string, @Request() req) {
      return this.bedService.findOne(id, req.user);
    }
  
    @Put(':id')
    async update(
      @Param('id') id: string,
      @Body() updateBedDto: UpdateBedDto,
      @Request() req,
    ) {
      return this.bedService.update(id, updateBedDto, req.user);
    }
  
    @Put(':id/status')
    async updateStatus(
      @Param('id') id: string,
      @Body() body: { status: string },
      @Request() req,
    ) {
      return this.bedService.updateStatus(id, body.status, req.user);
    }
  
    @Delete(':id')
    async remove(@Param('id') id: string, @Request() req) {
      return this.bedService.remove(id, req.user);
    }
  }