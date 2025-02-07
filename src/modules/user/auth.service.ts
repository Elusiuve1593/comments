import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signup({
    email,
    password,
    username,
    avatar,
  }: SignUpDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      username,
      avatar,
      email,
      password: hashedPassword,
    });
    await this.userRepository.save(user);
    return plainToClass(User, user);
  }

  async signin({ email, password }: SignInDto): Promise<{ token: string }> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ userId: user.id, email: user.email });
    return { token };
  }

  async logout(token: string, userId: number): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.blacklistedTokens) {
      user.blacklistedTokens = [];
    }

    user.blacklistedTokens.push(token);
    await this.userRepository.save(user);

    return { message: 'User successfully logged out' };
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const decoded: any = this.jwtService.decode(token);
    const user = await this.userRepository.findOne({
      where: { id: decoded.userId },
    });

    if (user && user.blacklistedTokens) {
      return user.blacklistedTokens.includes(token);
    }
    return false;
  }

  async getUser(token: string): Promise<User> {
    const decoded: any = this.jwtService.decode(token);
    const user = await this.userRepository.findOne({
      where: { id: decoded.userId },
    });
    return plainToClass(User, user);
  }
}
