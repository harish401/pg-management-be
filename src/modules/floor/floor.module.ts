import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FloorController } from './floor.controller';
import { FloorService } from './floor.service';
import { Floor, FloorSchema } from './schemas/floor.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Floor.name, schema: FloorSchema }]),
  ],
  controllers: [FloorController],
  providers: [FloorService],
  exports: [FloorService],
})
export class FloorModule {}