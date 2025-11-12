import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room, RoomDocument } from './schemas/room.schema';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
  ) {}

  async create(createRoomDto: CreateRoomDto, user: any) {
    const room = new this.roomModel({
      ...createRoomDto,
      entityId: user.entityId,
    });

    return room.save();
  }

  async findAll(entityId: string) {
    return this.roomModel
      .find({ entityId, isActive: true })
      .populate('floorId')
      .populate('buildingId')
      .sort({ buildingId: 1, floorId: 1, roomNumber: 1 })
      .exec();
  }

  async findByFloor(floorId: string) {
    return this.roomModel
      .find({ floorId, isActive: true })
      .sort({ roomNumber: 1 })
      .exec();
  }

  async findByBuilding(buildingId: string) {
    return this.roomModel
      .find({ buildingId, isActive: true })
      .populate('floorId')
      .sort({ floorId: 1, roomNumber: 1 })
      .exec();
  }

  async findOne(id: string, user: any) {
    const room = await this.roomModel
      .findOne({ _id: id, entityId: user.entityId })
      .populate('floorId')
      .populate('buildingId')
      .exec();

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return room;
  }

  async update(id: string, updateRoomDto: UpdateRoomDto, user: any) {
    const room = await this.roomModel
      .findOneAndUpdate(
        { _id: id, entityId: user.entityId },
        { $set: updateRoomDto },
        { new: true },
      )
      .exec();

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return room;
  }

  async updateLayout(id: string, layout: any, user: any) {
    const room = await this.roomModel
      .findOneAndUpdate(
        { _id: id, entityId: user.entityId },
        { $set: { layout } },
        { new: true },
      )
      .exec();

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return room;
  }

  async remove(id: string, user: any) {
    const room = await this.roomModel
      .findOneAndUpdate(
        { _id: id, entityId: user.entityId },
        { $set: { isActive: false } },
        { new: true },
      )
      .exec();

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return { message: 'Room deleted successfully' };
  }

  async getOccupancyStats(entityId: string) {
    const rooms = await this.roomModel.find({ entityId, isActive: true }).exec();
    const totalBeds = rooms.reduce((sum, room) => sum + room.totalBeds, 0);

    // You would need to query beds collection for occupied count
    // This is a placeholder
    return {
      totalRooms: rooms.length,
      totalBeds,
      occupiedBeds: 0, // To be calculated from beds
      availableBeds: totalBeds,
      occupancyRate: 0,
    };
  }

  async count(entityId: string) {
    return this.roomModel.countDocuments({ entityId, isActive: true }).exec();
  }
}