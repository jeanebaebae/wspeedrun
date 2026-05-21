import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private validateEmail(email: string) {
    const atCount = email.split('@').length - 1;

    if (atCount !== 1) {
      throw new BadRequestException('Email must contain exactly one @ character');
    }

    if (!email.includes('.')) {
      throw new BadRequestException('Email must contain at least one dot');
    }

    if (email.includes('@.') || email.includes('.@')) {
      throw new BadRequestException('@ and dot cannot be adjacent');
    }
  }

  private validatePassword(password: string) {
    const hasUppercase = password.split('').some((char) => char >= 'A' && char <= 'Z');
    const hasLowercase = password.split('').some((char) => char >= 'a' && char <= 'z');
    const hasNumber = password.split('').some((char) => char >= '0' && char <= '9');
    const hasSpecial = password.split('').some((char) => {
      return !(
        (char >= 'A' && char <= 'Z') ||
        (char >= 'a' && char <= 'z') ||
        (char >= '0' && char <= '9')
      );
    });

    if (!hasUppercase) {
      throw new BadRequestException('Password must contain at least one uppercase letter');
    }

    if (!hasLowercase) {
      throw new BadRequestException('Password must contain at least one lowercase letter');
    }

    if (!hasNumber) {
      throw new BadRequestException('Password must contain at least one number');
    }

    if (!hasSpecial) {
      throw new BadRequestException('Password must contain at least one special character');
    }
  }

  async register(registerDto: RegisterDto) {
    const { username, email, country, password } = registerDto;

    this.validateEmail(email);
    this.validatePassword(password);

    const existingUser = await this.prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      throw new BadRequestException('Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.prisma.users.create({
      data: {
        user_id: randomUUID(),
        username,
        email,
        country,
        password: hashedPassword,
        role: 'USER',
      },
    });

    return {
      message: 'User registered successfully',
      data: {
        user_id: newUser.user_id,
        username: newUser.username,
        email: newUser.email,
        country: newUser.country,
        role: newUser.role,
      },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Email is not registered');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = {
      id: user.user_id,
      role: user.role,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      message: 'Login successful',
      access_token: token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        country: user.country,
        role: user.role,
      },
    };
  }
}
