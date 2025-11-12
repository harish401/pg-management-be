import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Floor, FloorDocument } from './schemas/floor.schema';
import { CreateFloorDto } from './dto/create-floor.dto';
import { UpdateFloorDto } from './dto/update-floor.dto';

@Injectable()
export class FloorService {
  constructor(
    @InjectModel(Floor.name) private floorModel: Model<FloorDocument>,
  ) {}

  async create(createFloorDto: CreateFloorDto, user: any) {
    const floor = new this.floorModel({
      ...createFloorDto,
      entityId: user.entityId,
    });

    return floor.save();
  }

  async findAll(entityId: string) {
    return this.floorModel
      .find({ entityId, isActive: true })
      .populate('buildingId')
      .sort({ buildingId: 1, floorNumber: 1 })
      .exec();
  }

  async findByBuilding(buildingId: string) {
    return this.floorModel
      .find({ buildingId, isActive: true })
      .sort({ floorNumber: 1 })
      .exec();
  }

  async findOne(id: string, user: any) {
    const floor = await this.floorModel
      .findOne({ _id: id, entityId: user.entityId })
      .populate('buildingId')
      .exec();

    if (!floor) {
      throw new NotFoundException('Floor not found');
    }

    return floor;
  }

  async update(id: string, updateFloorDto: UpdateFloorDto, user: any) {
    const floor = await this.floorModel
      .findOneAndUpdate(
        { _id: id, entityId: user.entityId },
        { $set: updateFloorDto },
        { new: true },
      )
      .exec();

    if (!floor) {
      throw new NotFoundException('Floor not found');
    }

    return floor;
  }

  async remove(id: string, user: any) {
    const floor = await this.floorModel
      .findOneAndUpdate(
        { _id: id, entityId: user.entityId },
        { $set: { isActive: false } },
        { new: true },
      )
      .exec();

    if (!floor) {
      throw new NotFoundException('Floor not found');
    }

    return { message: 'Floor deleted successfully' };
  }
}