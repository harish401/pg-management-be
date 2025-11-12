import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bed, BedDocument } from './schemas/bed.schema';
import { CreateBedDto } from './dto/create-bed.dto';
import { UpdateBedDto } from './dto/update-bed.dto';

@Injectable()
export class BedService {
  constructor(
    @InjectModel(Bed.name) private bedModel: Model<BedDocument>,
  ) {}

  async create(createBedDto: CreateBedDto, user: any) {
    const bed = new this.bedModel({
      ...createBedDto,
      entityId: user.entityId,
    });

    return bed.save();
  }

  async createMultiple(beds: CreateBedDto[]) {
    return this.bedModel.insertMany(beds);
  }

  async findAll(entityId: string) {
    return this.bedModel
      .find({ entityId, isActive: true })
      .populate('roomId')
      .populate('studentId')
      .sort({ buildingId: 1, floorId: 1, roomId: 1, bedNumber: 1 })
      .exec();
  }

  async findByRoom(roomId: string) {
    return this.bedModel
      .find({ roomId, isActive: true })
      .populate('studentId')
      .sort({ bedNumber: 1 })
      .exec();
  }

  async findAvailable(entityId: string) {
    return this.bedModel
      .find({ entityId, status: 'AVAILABLE', isActive: true })
      .populate('roomId')
      .sort({ buildingId: 1, floorId: 1, roomId: 1, bedNumber: 1 })
      .exec();
  }

  async findOne(id: string, user: any) {
    const bed = await this.bedModel
      .findOne({ _id: id, entityId: user.entityId })
      .populate('roomId')
      .populate('studentId')
      .exec();

    if (!bed) {
      throw new NotFoundException('Bed not found');
    }

    return bed;
  }

  async update(id: string, updateBedDto: UpdateBedDto, user: any) {
    const bed = await this.bedModel
      .findOneAndUpdate(
        { _id: id, entityId: user.entityId },
        { $set: updateBedDto },
        { new: true },
      )
      .exec();

    if (!bed) {
      throw new NotFoundException('Bed not found');
    }

    return bed;
  }

  async updateStatus(id: string, status: string, user: any) {
    const bed = await this.bedModel
      .findOneAndUpdate(
        { _id: id, entityId: user.entityId },
        { $set: { status } },
        { new: true },
      )
      .exec();

    if (!bed) {
      throw new NotFoundException('Bed not found');
    }

    return bed;
  }

  async remove(id: string, user: any) {
    const bed = await this.bedModel.findOne({ _id: id, entityId: user.entityId });

    if (!bed) {
      throw new NotFoundException('Bed not found');
    }

    if (bed.isOccupied) {
      throw new BadRequestException('Cannot delete an occupied bed');
    }

    bed.isActive = false;
    await bed.save();

    return { message: 'Bed deleted successfully' };
  }

  async countOccupied(entityId: string) {
    return this.bedModel.countDocuments({
      entityId,
      isOccupied: true,
      isActive: true,
    }).exec();
  }

  async countAvailable(entityId: string) {
    return this.bedModel.countDocuments({
      entityId,
      status: 'AVAILABLE',
      isActive: true,
    }).exec();
  }

  async count(entityId: string) {
    return this.bedModel.countDocuments({ entityId, isActive: true }).exec();
  }
}