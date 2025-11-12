import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import { Student, StudentDocument } from '../student/schemas/student.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { MarkPaidDto } from './dto/mark-paid.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto, user: any) {
    const payment = new this.paymentModel({
      ...createPaymentDto,
      entityId: user.entityId,
    });

    return payment.save();
  }

  async createMonthlyPayments(entityId: string, month: string) {
    const students = await this.studentModel.find({
      entityId,
      isActive: true,
      bedId: { $ne: null },
    });

    const payments = students.map((student) => ({
      entityId,
      studentId: student._id,
      bedId: student.bedId,
      month,
      amount: student.monthlyRent,
      dueDate: new Date(`${month}-05`), // Due on 5th of every month
      status: 'PENDING',
    }));

    return this.paymentModel.insertMany(payments);
  }

  async findAll(entityId: string, month?: string) {
    const query: any = { entityId };

    if (month) {
      query.month = month;
    }

    return this.paymentModel
      .find(query)
      .populate('studentId')
      .populate('bedId')
      .sort({ dueDate: -1 })
      .exec();
  }

  async findByMonth(entityId: string, month: string) {
    return this.paymentModel
      .find({ entityId, month })
      .populate('studentId')
      .populate('bedId')
      .sort({ status: 1, dueDate: 1 })
      .exec();
  }

  async findByStudent(studentId: string) {
    return this.paymentModel
      .find({ studentId })
      .sort({ month: -1 })
      .exec();
  }

  async findOne(id: string, user: any) {
    const payment = await this.paymentModel
      .findOne({ _id: id, entityId: user.entityId })
      .populate('studentId')
      .populate('bedId')
      .exec();

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async markAsPaid(id: string, markPaidDto: MarkPaidDto, user: any) {
    const payment = await this.paymentModel
      .findOneAndUpdate(
        { _id: id, entityId: user.entityId },
        {
          $set: {
            status: 'PAID',
            paidDate: markPaidDto.paidDate || new Date(),
            paymentMode: markPaidDto.paymentMode,
            transactionId: markPaidDto.transactionId,
            remarks: markPaidDto.remarks,
            receiptUrl: markPaidDto.receiptUrl,
            lateFee: markPaidDto.lateFee || 0,
            discount: markPaidDto.discount || 0,
            collectedBy: markPaidDto.collectedBy,
          },
        },
        { new: true },
      )
      .exec();

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async updateOverduePayments(entityId: string) {
    const today = new Date();
    
    await this.paymentModel.updateMany(
      {
        entityId,
        status: 'PENDING',
        dueDate: { $lt: today },
      },
      {
        $set: { status: 'OVERDUE' },
      },
    );
  }

  async getPaymentStats(entityId: string, month: string) {
    const payments = await this.paymentModel.find({ entityId, month });

    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
    const paidAmount = payments
      .filter((p) => p.status === 'PAID')
      .reduce((sum, p) => sum + p.amount - (p.discount || 0) + (p.lateFee || 0), 0);
    const pendingAmount = totalAmount - paidAmount;

    return {
      totalPayments: payments.length,
      totalAmount,
      paidAmount,
      pendingAmount,
      paidCount: payments.filter((p) => p.status === 'PAID').length,
      pendingCount: payments.filter((p) => p.status === 'PENDING').length,
      overdueCount: payments.filter((p) => p.status === 'OVERDUE').length,
      collectionRate: totalAmount > 0 ? ((paidAmount / totalAmount) * 100).toFixed(2) : 0,
    };
  }

  async getRecentPayments(entityId: string, limit = 10) {
    return this.paymentModel
      .find({ entityId, status: 'PAID' })
      .populate('studentId')
      .sort({ paidDate: -1 })
      .limit(limit)
      .exec();
  }
}