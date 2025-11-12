import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    ConflictException,
  } from '@nestjs/common';
  import { InjectModel } from '@nestjs/mongoose';
  import { Model } from 'mongoose';
  import { Entity, EntityDocument } from './schemas/entity.schema';
  import { CreateEntityDto } from './dto/create-entity.dto';
  import { UpdateEntityDto } from './dto/update-entity.dto';
  
  @Injectable()
  export class EntityService {
    constructor(
      @InjectModel(Entity.name) private entityModel: Model<EntityDocument>,
    ) {}
  
    async create(createEntityDto: CreateEntityDto) {
      const existingEntity = await this.entityModel.findOne({
        email: createEntityDto.email,
      });
  
      if (existingEntity) {
        throw new ConflictException('Entity with this email already exists');
      }
  
      // Set default subscription plan dates
      if (createEntityDto.subscriptionPlan) {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setFullYear(endDate.getFullYear() + 1); // 1 year subscription
  
        createEntityDto.subscriptionPlan.startDate = startDate;
        createEntityDto.subscriptionPlan.endDate = endDate;
      }
  
      const entity = new this.entityModel(createEntityDto);
      return entity.save();
    }
  
    async findAll() {
      return this.entityModel
        .find()
        .sort({ createdAt: -1 })
        .exec();
    }
  
    async findOne(id: string, user?: any) {
      const query: any = { _id: id };
  
      // Entity admin can only see their own entity
      if (user?.role === 'ENTITY_ADMIN') {
        query._id = user.entityId;
      }
  
      const entity = await this.entityModel.findOne(query).exec();
  
      if (!entity) {
        throw new NotFoundException('Entity not found');
      }
  
      return entity;
    }
  
    async update(id: string, updateEntityDto: UpdateEntityDto, user?: any) {
      // Only super admin can update any entity
      if (user?.role !== 'SUPER_ADMIN' && user?.entityId?.toString() !== id) {
        throw new ForbiddenException('You can only update your own entity');
      }
  
      const entity = await this.entityModel
        .findByIdAndUpdate(id, { $set: updateEntityDto }, { new: true })
        .exec();
  
      if (!entity) {
        throw new NotFoundException('Entity not found');
      }
  
      return entity;
    }
  
    async remove(id: string) {
      const entity = await this.entityModel
        .findByIdAndUpdate(id, { $set: { isActive: false } }, { new: true })
        .exec();
  
      if (!entity) {
        throw new NotFoundException('Entity not found');
      }
  
      return { message: 'Entity deleted successfully' };
    }
  
    async toggleStatus(id: string) {
      const entity = await this.entityModel.findById(id).exec();
  
      if (!entity) {
        throw new NotFoundException('Entity not found');
      }
  
      entity.isActive = !entity.isActive;
      await entity.save();
  
      return entity;
    }
  
    async updateFeatures(id: string, features: any) {
      const entity = await this.entityModel
        .findByIdAndUpdate(
          id,
          { $set: { features } },
          { new: true },
        )
        .exec();
  
      if (!entity) {
        throw new NotFoundException('Entity not found');
      }
  
      return entity;
    }
  
    async count() {
      return this.entityModel.countDocuments({ isActive: true }).exec();
    }
  }