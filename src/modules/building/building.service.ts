import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Building, BuildingDocument } from './schemas/building.schema';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';

@Injectable()
export class BuildingService {
  constructor(
    @InjectModel(Building.name) private buildingModel: Model<BuildingDocument>,
  ) {}

  async create(createBuildingDto: CreateBuildingDto, user: any) {
    const building = new this.buildingModel({
      ...createBuildingDto,
      entityId: user.entityId,
    });

    return building.save();
  }

  async findAll(entityId: string) {
    return this.buildingModel
      .find({ entityId, isActive: true })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string, user: any) {
    const building = await this.buildingModel
      .findOne({ _id: id, entityId: user.entityId })
      .exec();

    if (!building) {
      throw new NotFoundException('Building not found');
    }

    return building;
  }

  async update(id: string, updateBuildingDto: UpdateBuildingDto, user: any) {
    const building = await this.buildingModel
      .findOneAndUpdate(
        { _id: id, entityId: user.entityId },
        { $set: updateBuildingDto },
        { new: true },
      )
      .exec();

    if (!building) {
      throw new NotFoundException('Building not found');
    }

    return building;
  }

  async remove(id: string, user: any) {
    const building = await this.buildingModel
      .findOneAndUpdate(
        { _id: id, entityId: user.entityId },
        { $set: { isActive: false } },
        { new: true },
      )
      .exec();

    if (!building) {
      throw new NotFoundException('Building not found');
    }

    return { message: 'Building deleted successfully' };
  }

  async count(entityId: string) {
    return this.buildingModel.countDocuments({ entityId, isActive: true }).exec();
  }
}