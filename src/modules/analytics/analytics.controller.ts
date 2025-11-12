import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('super-admin')
  @Roles('SUPER_ADMIN')
  async getSuperAdminDashboard() {
    return this.analyticsService.getSuperAdminDashboard();
  }

  @Get('entity/:entityId')
  async getEntityDashboard(@Param('entityId') entityId: string) {
    return this.analyticsService.getEntityDashboard(entityId);
  }

  @Get('payments/:entityId')
  async getPaymentAnalytics(
    @Param('entityId') entityId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.analyticsService.getPaymentAnalytics(entityId, start, end);
  }

  @Get('buildings/:entityId')
  async getBuildingWiseOccupancy(@Param('entityId') entityId: string) {
    return this.analyticsService.getBuildingWiseOccupancy(entityId);
  }
}