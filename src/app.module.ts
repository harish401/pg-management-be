import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { EntityModule } from './modules/entity/entity.module';
import { BuildingModule } from './modules/building/building.module';
import { FloorModule } from './modules/floor/floor.module';
import { RoomModule } from './modules/room/room.module';
import { BedModule } from './modules/bed/bed.module';
import { StudentModule } from './modules/student/student.module';
import { PaymentModule } from './modules/payment/payment.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    EntityModule,
    BuildingModule,
    FloorModule,
    RoomModule,
    BedModule,
    StudentModule,
    PaymentModule,
    AnalyticsModule,
    SubscriptionModule,
  ],
})
export class AppModule {}
