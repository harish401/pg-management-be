import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    UseGuards,
  } from '@nestjs/common';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { RolesGuard } from '../auth/guards/roles.guard';
  import { Roles } from '../auth/decorators/roles.decorator';
  import { SubscriptionService } from './subscription.service';
  import { CreateSubscriptionDto } from './dto/create-subscription.dto';
  
  @Controller('subscriptions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  export class SubscriptionController {
    constructor(private readonly subscriptionService: SubscriptionService) {}
  
    @Post()
    @Roles('SUPER_ADMIN')
    async create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
      return this.subscriptionService.create(createSubscriptionDto);
    }
  
    @Get()
    async findAll() {
      return this.subscriptionService.findAll();
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string) {
      return this.subscriptionService.findOne(id);
    }
  
    @Put(':id')
    @Roles('SUPER_ADMIN')
    async update(
      @Param('id') id: string,
      @Body() updateDto: Partial<CreateSubscriptionDto>,
    ) {
      return this.subscriptionService.update(id, updateDto);
    }
  
    @Delete(':id')
    @Roles('SUPER_ADMIN')
    async remove(@Param('id') id: string) {
      return this.subscriptionService.remove(id);
    }
  }