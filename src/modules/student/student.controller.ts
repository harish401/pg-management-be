import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    Request,
  } from '@nestjs/common';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { StudentService } from './student.service';
  import { CreateStudentDto } from './dto/create-student.dto';
  import { UpdateStudentDto } from './dto/update-student.dto';
  
  @Controller('students')
  @UseGuards(JwtAuthGuard, RolesGuard)
  export class StudentController {
    constructor(private readonly studentService: StudentService) {}
  
    @Post()
    async create(@Body() createStudentDto: CreateStudentDto, @Request() req) {
      return this.studentService.create(createStudentDto, req.user);
    }
  
    @Get('entity/:entityId')
    async findAll(@Param('entityId') entityId: string, @Query() filters: any) {
      return this.studentService.findAll(entityId, filters);
    }
  
    @Get('stats/:entityId')
    async getStats(@Param('entityId') entityId: string) {
      return this.studentService.getStudentStats(entityId);
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string, @Request() req) {
      return this.studentService.findOne(id, req.user);
    }
  
    @Put(':id')
    async update(
      @Param('id') id: string,
      @Body() updateStudentDto: UpdateStudentDto,
      @Request() req,
    ) {
      return this.studentService.update(id, updateStudentDto, req.user);
    }
  
    @Post(':id/allocate')
    async allocateBed(
      @Param('id') id: string,
      @Body() body: { bedId: string },
      @Request() req,
    ) {
      return this.studentService.allocateBed(id, body.bedId, req.user);
    }
  
    @Post(':id/vacate')
    async vacateBed(@Param('id') id: string, @Request() req) {
      return this.studentService.vacateBed(id, req.user);
    }
  
    @Delete(':id')
    async remove(@Param('id') id: string, @Request() req) {
      return this.studentService.remove(id, req.user);
    }
  }