import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { Entity, EntitySchema } from '../entity/schemas/entity.schema';
import { Student, StudentSchema } from '../student/schemas/student.schema';
import { Bed, BedSchema } from '../bed/schemas/bed.schema';
import { Payment, PaymentSchema } from '../payment/schemas/payment.schema';
import { Building, BuildingSchema } from '../building/schemas/building.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Entity.name, schema: EntitySchema },
      { name: Student.name, schema: StudentSchema },
      { name: Bed.name, schema: BedSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: Building.name, schema: BuildingSchema },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}