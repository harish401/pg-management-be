import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BedController } from './bed.controller';
import { BedService } from './bed.service';
import { Bed, BedSchema } from './schemas/bed.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Bed.name, schema: BedSchema }]),
  ],
  controllers: [BedController],
  providers: [BedService],
  exports: [BedService],
})
export class BedModule {}