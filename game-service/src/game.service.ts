// game.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateGameDto } from './dto/create-game.dto';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}

  async getAllGames() {
    return this.prisma.game.findMany();
  }

  async getGameDetails(game_id: string) {
    const game = await this.prisma.game.findUnique({
      where: { game_id },
      include: { categories: true },
    });
    if (!game) throw new NotFoundException('Game not found');
    return game;
  }

  async createGame(data: CreateGameDto) {
    await this.prisma.game.create({ data });
    return { message: 'Game successfully created' };
  }

  async updateGame(game_id: string, data: Partial<CreateGameDto>) {
    await this.prisma.game.update({
      where: { game_id },
      data,
    });
    return { message: 'Game successfully updated' };
  }

  async deleteGame(game_id: string) {
    await this.prisma.game.delete({ where: { game_id } });
    return { message: 'Game successfully deleted' };
  }

  async getCategoryDetails(run_category_id: string) {
    const category = await this.prisma.runCategory.findUnique({
      where: { run_category_id },
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async createCategory(data: CreateCategoryDto) {
    const gameExists = await this.prisma.game.findUnique({ where: { game_id: data.game_id } });
    if (!gameExists) throw new NotFoundException('Game ID must exist');

    await this.prisma.runCategory.create({ data });
    return { message: 'Category successfully created' };
  }

  async updateCategory(run_category_id: string, data: Partial<CreateCategoryDto>) {
    await this.prisma.runCategory.update({
      where: { run_category_id },
      data,
    });
    return { message: 'Category successfully updated' };
  }

  async deleteCategory(run_category_id: string) {
    await this.prisma.runCategory.delete({ where: { run_category_id } });
    return { message: 'Category successfully deleted' };
  }
}