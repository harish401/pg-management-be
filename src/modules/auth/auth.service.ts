import {
    Injectable,
    UnauthorizedException,
    ConflictException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { InjectModel } from '@nestjs/mongoose';
  import { Model } from 'mongoose';
  import * as bcrypt from 'bcrypt';
  import { User, UserDocument } from './schemas/user.schema';
  import { LoginDto } from './dto/login.dto';
  import { RegisterDto } from './dto/register.dto';
  
  @Injectable()
  export class AuthService {
    constructor(
      @InjectModel(User.name) private userModel: Model<UserDocument>,
      private jwtService: JwtService,
    ) {}
  
    async register(registerDto: RegisterDto) {
      const existingUser = await this.userModel.findOne({
        email: registerDto.email,
      });
  
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
  
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
  
      const user = new this.userModel({
        email: registerDto.email,
        password: hashedPassword,
        role: registerDto.role,
        entityId: registerDto.entityId || null,
      });
  
      await user.save();
  
      const { password, ...result } = user.toObject();
      return result;
    }
  
    async login(loginDto: LoginDto) {
      const user = await this.userModel.findOne({ email: loginDto.email });
  
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
  
      const isPasswordValid = await bcrypt.compare(
        loginDto.password,
        user.password,
      );
  
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
  
      if (!user.isActive) {
        throw new UnauthorizedException('Account is deactivated');
      }
  
      // Update last login
      user.lastLogin = new Date();
      await user.save();
  
      // Extract entityId as string only
      const entityIdString = user.entityId ? user.entityId.toString() : null;
  
      const payload = {
        email: user.email,
        sub: user._id.toString(),
        role: user.role,
        entityId: entityIdString,
      };
  
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          entityId: entityIdString,
        },
      };
    }
  
    async validateUser(email: string, password: string): Promise<any> {
      const user = await this.userModel.findOne({ email });
  
      if (user && (await bcrypt.compare(password, user.password))) {
        const { password, ...result } = user.toObject();
        return result;
      }
  
      return null;
    }
  }