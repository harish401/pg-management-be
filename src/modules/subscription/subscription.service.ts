import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subscription, SubscriptionDocument } from './schemas/subscription.schema';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<SubscriptionDocument>,
  ) {}

  async create(createSubscriptionDto: CreateSubscriptionDto) {
    const existingPlan = await this.subscriptionModel.findOne({
      planName: createSubscriptionDto.planName,
    });

    if (existingPlan) {
      throw new ConflictException('Subscription plan with this name already exists');
    }

    const subscription = new this.subscriptionModel(createSubscriptionDto);
    return subscription.save();
  }

  async findAll() {
    return this.subscriptionModel
      .find({ isActive: true })
      .sort({ price: 1 })
      .exec();
  }

  async findOne(id: string) {
    const subscription = await this.subscriptionModel.findById(id).exec();

    if (!subscription) {
      throw new NotFoundException('Subscription plan not found');
    }

    return subscription;
  }

  async update(id: string, updateDto: Partial<CreateSubscriptionDto>) {
    const subscription = await this.subscriptionModel
      .findByIdAndUpdate(id, { $set: updateDto }, { new: true })
      .exec();

    if (!subscription) {
      throw new NotFoundException('Subscription plan not found');
    }

    return subscription;
  }

  async remove(id: string) {
    const subscription = await this.subscriptionModel
      .findByIdAndUpdate(id, { $set: { isActive: false } }, { new: true })
      .exec();

    if (!subscription) {
      throw new NotFoundException('Subscription plan not found');
    }

    return { message: 'Subscription plan deleted successfully' };
  }
}