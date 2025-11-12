import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Entity, EntityDocument } from '../entity/schemas/entity.schema';
import { Student, StudentDocument } from '../student/schemas/student.schema';
import { Bed, BedDocument } from '../bed/schemas/bed.schema';
import { Payment, PaymentDocument } from '../payment/schemas/payment.schema';
import { Building, BuildingDocument } from '../building/schemas/building.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Entity.name) private entityModel: Model<EntityDocument>,
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    @InjectModel(Bed.name) private bedModel: Model<BedDocument>,
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @InjectModel(Building.name) private buildingModel: Model<BuildingDocument>,
  ) {}

  async getSuperAdminDashboard() {
    const totalEntities = await this.entityModel.countDocuments({ isActive: true });
    const totalStudents = await this.studentModel.countDocuments({ isActive: true });
    const totalBeds = await this.bedModel.countDocuments({ isActive: true });
    const totalBuildings = await this.buildingModel.countDocuments({ isActive: true });

    const currentMonth = new Date().toISOString().slice(0, 7);
    const paidPayments = await this.paymentModel.find({
      month: currentMonth,
      status: 'PAID',
    });

    const monthlyRevenue = paidPayments.reduce(
      (sum, p) => sum + p.amount - (p.discount || 0) + (p.lateFee || 0),
      0,
    );

    // Entity growth (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const entityGrowth = await this.entityModel.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
      {
        $project: {
          _id: 0,
          month: {
            $concat: [
              { $toString: '$_id.year' },
              '-',
              {
                $cond: [
                  { $lt: ['$_id.month', 10] },
                  { $concat: ['0', { $toString: '$_id.month' }] },
                  { $toString: '$_id.month' },
                ],
              },
            ],
          },
          count: 1,
        },
      },
    ]);

    // Revenue trend
    const revenueTrend = await this.paymentModel.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          status: 'PAID',
        },
      },
      {
        $group: {
          _id: '$month',
          revenue: {
            $sum: {
              $add: [
                '$amount',
                { $ifNull: ['$lateFee', 0] },
                { $multiply: [{ $ifNull: ['$discount', 0] }, -1] },
              ],
            },
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          _id: 0,
          month: '$_id',
          revenue: 1,
        },
      },
    ]);

    // Active vs Inactive entities
    const activeEntities = await this.entityModel.countDocuments({ isActive: true });
    const inactiveEntities = await this.entityModel.countDocuments({ isActive: false });

    return {
      totalEntities,
      totalStudents,
      totalBeds,
      totalBuildings,
      monthlyRevenue,
      entityGrowth,
      revenueTrend,
      activeEntities,
      inactiveEntities,
    };
  }

  async getEntityDashboard(entityId: string) {
    const totalBeds = await this.bedModel.countDocuments({
      entityId,
      isActive: true,
    });

    const occupiedBeds = await this.bedModel.countDocuments({
      entityId,
      isOccupied: true,
      isActive: true,
    });

    const totalStudents = await this.studentModel.countDocuments({
      entityId,
      isActive: true,
    });

    const totalBuildings = await this.buildingModel.countDocuments({
      entityId,
      isActive: true,
    });

    const currentMonth = new Date().toISOString().slice(0, 7);

    const paymentStats = await this.paymentModel.aggregate([
      {
        $match: {
          entityId: entityId,
          month: currentMonth,
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          amount: {
            $sum: {
              $add: [
                '$amount',
                { $ifNull: ['$lateFee', 0] },
                { $multiply: [{ $ifNull: ['$discount', 0] }, -1] },
              ],
            },
          },
        },
      },
    ]);

    const paidPayments = paymentStats.find((p) => p._id === 'PAID') || {
      count: 0,
      amount: 0,
    };
    const pendingPayments = paymentStats.find((p) => p._id === 'PENDING') || {
      count: 0,
      amount: 0,
    };
    const overduePayments = paymentStats.find((p) => p._id === 'OVERDUE') || {
      count: 0,
      amount: 0,
    };

    // Occupancy trend (last 6 months)
    const occupancyTrend = await this.getOccupancyTrend(entityId);

    // Recent students
    const recentStudents = await this.studentModel
      .find({ entityId, isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('bedId')
      .populate('roomId')
      .exec();

    // Gender distribution
    const genderStats = await this.studentModel.aggregate([
      {
        $match: {
          entityId: entityId,
          isActive: true,
        },
      },
      {
        $group: {
          _id: '$personalInfo.gender',
          count: { $sum: 1 },
        },
      },
    ]);

    return {
      totalBeds,
      occupiedBeds,
      availableBeds: totalBeds - occupiedBeds,
      occupancyRate: totalBeds > 0 ? ((occupiedBeds / totalBeds) * 100).toFixed(2) : 0,
      totalStudents,
      totalBuildings,
      paidPayments: paidPayments.count,
      paidAmount: paidPayments.amount,
      pendingPayments: pendingPayments.count,
      pendingAmount: pendingPayments.amount,
      overduePayments: overduePayments.count,
      overdueAmount: overduePayments.amount,
      occupancyTrend,
      recentStudents,
      genderStats,
    };
  }

  private async getOccupancyTrend(entityId: string): Promise<Array<{
    month: string;
    occupancy: number;
    occupied: number;
    total: number;
  }>> {
    // For a real implementation, you'd need a historical tracking table
    // This is a simplified version
    const months: Array<{
      month: string;
      occupancy: number;
      occupied: number;
      total: number;
    }> = [];
    
    const totalBeds = await this.bedModel.countDocuments({ entityId, isActive: true });

    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.toISOString().slice(0, 7);

      // In real scenario, you'd query historical data
      const occupiedBeds = await this.bedModel.countDocuments({
        entityId,
        isOccupied: true,
        isActive: true,
      });

      months.push({
        month,
        occupancy: totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0,
        occupied: occupiedBeds,
        total: totalBeds,
      });
    }

    return months;
  }

  async getPaymentAnalytics(entityId: string, startDate?: Date, endDate?: Date) {
    const match: any = { entityId };

    if (startDate && endDate) {
      match.createdAt = { $gte: startDate, $lte: endDate };
    }

    const analytics = await this.paymentModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            month: '$month',
            status: '$status',
          },
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          totalCollected: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'PAID'] },
                {
                  $add: [
                    '$amount',
                    { $ifNull: ['$lateFee', 0] },
                    { $multiply: [{ $ifNull: ['$discount', 0] }, -1] },
                  ],
                },
                0,
              ],
            },
          },
        },
      },
      { $sort: { '_id.month': 1 } },
    ]);

    return analytics;
  }

  async getBuildingWiseOccupancy(entityId: string) {
    const buildings = await this.buildingModel.find({ entityId, isActive: true });

    const buildingStats = await Promise.all(
      buildings.map(async (building) => {
        const totalBeds = await this.bedModel.countDocuments({
          buildingId: building._id,
          isActive: true,
        });

        const occupiedBeds = await this.bedModel.countDocuments({
          buildingId: building._id,
          isOccupied: true,
          isActive: true,
        });

        return {
          buildingId: building._id,
          buildingName: building.name,
          totalBeds,
          occupiedBeds,
          availableBeds: totalBeds - occupiedBeds,
          occupancyRate: totalBeds > 0 ? ((occupiedBeds / totalBeds) * 100).toFixed(2) : 0,
        };
      }),
    );

    return buildingStats;
  }
}