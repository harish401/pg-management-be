import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Student, StudentDocument } from './schemas/student.schema';
import { Bed, BedDocument } from '../bed/schemas/bed.schema';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    @InjectModel(Bed.name) private bedModel: Model<BedDocument>,
  ) {}

  async create(createStudentDto: CreateStudentDto, user: any) {
    const student = new this.studentModel({
      ...createStudentDto,
      entityId: user.entityId,
    });

    return student.save();
  }

  async findAll(entityId: string, filters?: any) {
    const query: any = { entityId };

    if (filters?.isActive !== undefined) {
      query.isActive = filters.isActive === 'true';
    }

    if (filters?.roomId) {
      query.roomId = filters.roomId;
    }

    if (filters?.bedId) {
      query.bedId = filters.bedId;
    }

    return this.studentModel
      .find(query)
      .populate('bedId')
      .populate('roomId')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string, user: any) {
    const student = await this.studentModel
      .findOne({ _id: id, entityId: user.entityId })
      .populate('bedId')
      .populate('roomId')
      .exec();

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto, user: any) {
    const student = await this.studentModel
      .findOneAndUpdate(
        { _id: id, entityId: user.entityId },
        { $set: updateStudentDto },
        { new: true },
      )
      .exec();

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  }

  async allocateBed(studentId: string, bedId: string, user: any) {
    // Check if bed exists and is available
    const bed = await this.bedModel.findOne({
      _id: bedId,
      entityId: user.entityId,
    });

    if (!bed) {
      throw new NotFoundException('Bed not found');
    }

    if (bed.isOccupied || bed.status !== 'AVAILABLE') {
      throw new BadRequestException('Bed is not available');
    }

    // Check if student exists
    const student = await this.studentModel.findOne({
      _id: studentId,
      entityId: user.entityId,
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    if (student.bedId) {
      throw new BadRequestException('Student already has a bed allocated');
    }

    // Update student
    student.bedId = bed._id as Types.ObjectId;
    student.roomId = bed.roomId as Types.ObjectId;
    student.allocatedOn = new Date();
    student.isActive = true;
    await student.save();

    // Update bed
    bed.isOccupied = true;
    bed.studentId = student._id as Types.ObjectId;
    bed.status = 'OCCUPIED';
    await bed.save();

    return student;
  }

  async vacateBed(studentId: string, user: any) {
    const student = await this.studentModel.findOne({
      _id: studentId,
      entityId: user.entityId,
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    if (!student.bedId) {
      throw new BadRequestException('Student does not have a bed allocated');
    }

    const bedId = student.bedId;

    // Update bed
    await this.bedModel.findByIdAndUpdate(bedId, {
      $set: {
        isOccupied: false,
        status: 'AVAILABLE',
      },
      $unset: { studentId: '' },
    });

    // Update student - use $unset for ObjectId fields
    const updatedStudent = await this.studentModel.findByIdAndUpdate(
      studentId,
      {
        $set: {
          vacatedOn: new Date(),
          isActive: false,
        },
        $unset: { bedId: '', roomId: '' },
      },
      { new: true },
    );

    return updatedStudent;
  }

  async remove(id: string, user: any) {
    const student = await this.studentModel.findOne({
      _id: id,
      entityId: user.entityId,
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // If student has a bed, vacate it first
    if (student.bedId) {
      await this.vacateBed(id, user);
    }

    await this.studentModel.findByIdAndDelete(id);

    return { message: 'Student deleted successfully' };
  }

  async getStudentStats(entityId: string) {
    const totalStudents = await this.studentModel.countDocuments({
      entityId,
      isActive: true,
    });

    const maleCount = await this.studentModel.countDocuments({
      entityId,
      isActive: true,
      'personalInfo.gender': 'MALE',
    });

    const femaleCount = await this.studentModel.countDocuments({
      entityId,
      isActive: true,
      'personalInfo.gender': 'FEMALE',
    });

    return {
      totalStudents,
      maleCount,
      femaleCount,
      otherCount: totalStudents - maleCount - femaleCount,
    };
  }

  async count(entityId: string) {
    return this.studentModel.countDocuments({ entityId, isActive: true }).exec();
  }
}