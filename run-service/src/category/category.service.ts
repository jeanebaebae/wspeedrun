import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomUUID } from 'crypto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async getCategoryDetails(categoryId: string) {
    const category = await this.prisma.runCategory.findUnique({
      where: {
        run_category_id: categoryId,
      },
    });

    if (!category) {
      throw new NotFoundException('Run category not found');
    }

    return category;
  }

  async createCategory(createCategoryDto: any, userRole: string) {
    if (userRole !== 'ADMIN') {
      throw new ForbiddenException('Admin access required');
    }

    const { game_id, run_category_name } = createCategoryDto;

    if (!game_id) {
      throw new BadRequestException('Game id must be filled');
    }

    if (!run_category_name) {
      throw new BadRequestException('Run category name must be filled');
    }

    const category = await this.prisma.runCategory.create({
      data: {
        run_category_id: randomUUID(),
        game_id,
        run_category_name,
      },
    });

    return {
      message: 'Category created successfully',
      data: category,
    };
  }

  async updateCategory(categoryId: string, updateData: any, userRole: string) {
    if (userRole !== 'ADMIN') {
      throw new ForbiddenException('Admin access required');
    }

    const existingCategory = await this.prisma.runCategory.findUnique({
      where: {
        run_category_id: categoryId,
      },
    });

    if (!existingCategory) {
      throw new NotFoundException('Run category not found');
    }

    const { game_id, run_category_name } = updateData;

    const updatedCategory = await this.prisma.runCategory.update({
      where: {
        run_category_id: categoryId,
      },
      data: {
        ...(game_id && { game_id }),
        ...(run_category_name && { run_category_name }),
      },
    });

    return {
      message: 'Category updated successfully',
      data: updatedCategory,
    };
  }

  async deleteCategory(categoryId: string, userRole: string) {
    if (userRole !== 'ADMIN') {
      throw new ForbiddenException('Admin access required');
    }

    const existingCategory = await this.prisma.runCategory.findUnique({
      where: {
        run_category_id: categoryId,
      },
    });

    if (!existingCategory) {
      throw new NotFoundException('Run category not found');
    }

    await this.prisma.runCategory.delete({
      where: {
        run_category_id: categoryId,
      },
    });

    return {
      message: 'Category deleted successfully',
    };
  }
}