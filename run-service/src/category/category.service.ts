import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

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

  async createCategory(createCategoryDto: CreateCategoryDto, userRole: string) {
    if (userRole !== 'ADMIN') {
      throw new ForbiddenException('Admin access required');
    }

    const { game_id, run_category_name } = createCategoryDto;

    if (!game_id) {
      throw new BadRequestException('Game ID is required');
    }

    if (!run_category_name || run_category_name.trim() === '') {
      throw new BadRequestException('Run category name is required');
    }

    await this.validateGameExists(game_id);

    const category = await this.prisma.runCategory.create({
      data: {
        game_id,
        run_category_name,
      },
    });

    return {
      message: 'Category created successfully',
      data: category,
    };
  }

  async updateCategory(
    categoryId: string,
    updateCategoryDto: UpdateCategoryDto,
    userRole: string,
  ) {
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

    const { game_id, run_category_name } = updateCategoryDto;

    if (!game_id && !run_category_name) {
      throw new BadRequestException('No data provided for update');
    }

    if (game_id) {
      await this.validateGameExists(game_id);
    }

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

  private async validateGameExists(gameId: string) {
    const gameServiceUrl = process.env.GAME_SERVICE_URL || 'http://localhost:3001';

    try {
      const response = await fetch(`${gameServiceUrl}/games/${gameId}`);

      if (response.status === 404) {
        throw new NotFoundException('Game ID does not exist');
      }

      if (!response.ok) {
        throw new BadRequestException('Failed to validate game ID');
      }
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new BadRequestException(
        'Cannot validate game ID because Game Service is unavailable',
      );
    }
  }
}