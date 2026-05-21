import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(id: string) {
    const user = await this.prisma.users.findUnique({
      where: {
        user_id: id,
      },
      select: {
        user_id: true,
        username: true,
        email: true,
        country: true,
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      message: 'User profile retrieved successfully',
      data: user,
    };
  }
}