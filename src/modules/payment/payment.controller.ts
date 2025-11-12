import {
    Controller,
    Get,
    Post,
    Put,
    Body,
    Param,
    UseGuards,
    Request,
  } from '@nestjs/common';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { PaymentService } from './payment.service';
  import { CreatePaymentDto } from './dto/create-payment.dto';
  import { MarkPaidDto } from './dto/mark-paid.dto';
  
  @Controller('payments')
  @UseGuards(JwtAuthGuard, RolesGuard)
  export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}
  
    @Post()
    async create(@Body() createPaymentDto: CreatePaymentDto, @Request() req) {
      return this.paymentService.create(createPaymentDto, req.user);
    }
  
    @Post('monthly')
    async createMonthlyPayments(
      @Body() body: { entityId: string; month: string },
    ) {
      return this.paymentService.createMonthlyPayments(body.entityId, body.month);
    }
  
    @Get('entity/:entityId')
    async findAll(@Param('entityId') entityId: string) {
      return this.paymentService.findAll(entityId);
    }
  
    @Get('entity/:entityId/month/:month')
    async findByMonth(
      @Param('entityId') entityId: string,
      @Param('month') month: string,
    ) {
      return this.paymentService.findByMonth(entityId, month);
    }
  
    @Get('student/:studentId')
    async findByStudent(@Param('studentId') studentId: string) {
      return this.paymentService.findByStudent(studentId);
    }
  
    @Get('stats/:entityId/month/:month')
    async getStats(
      @Param('entityId') entityId: string,
      @Param('month') month: string,
    ) {
      return this.paymentService.getPaymentStats(entityId, month);
    }
  
    @Get('recent/:entityId')
    async getRecentPayments(@Param('entityId') entityId: string) {
      return this.paymentService.getRecentPayments(entityId);
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string, @Request() req) {
      return this.paymentService.findOne(id, req.user);
    }
  
    @Put(':id/mark-paid')
    async markAsPaid(
      @Param('id') id: string,
      @Body() markPaidDto: MarkPaidDto,
      @Request() req,
    ) {
      return this.paymentService.markAsPaid(id, markPaidDto, req.user);
    }
  }