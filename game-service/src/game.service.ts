// game.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateGameDto } from './dto/create-game.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { randomUUID } from 'crypto';
import { UpdateGameDto } from './dto/update-game.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}

  async getAllGames() {
    return this.prisma.games.findMany();
  }

  async getGameDetails(game_id: string) {
    const game = await this.prisma.games.findUnique({
      where: { game_id },
      include: {
        run_categories: true,
      },
    });

    if (!game) throw new NotFoundException('Game not found');

    return game;
  }

  async createGame(data: CreateGameDto) {
    await this.prisma.games.create({
      data: {
        game_id: randomUUID(),
        game_name: data.game_name,
        description: data.description,
      },
    });

    return { message: 'Game successfully created' };
  }

  async updateGame(game_id: string, data: UpdateGameDto) {
    await this.prisma.games.update({
      where: { game_id },
      data,
    });

    return { message: 'Game successfully updated' };
  }

  async deleteGame(game_id: string) {
    await this.prisma.games.delete({
      where: { game_id },
    });

    return { message: 'Game successfully deleted' };
  }

  async getCategoryDetails(run_category_id: string) {
    const category = await this.prisma.run_categories.findUnique({
      where: { run_category_id },
    });

    if (!category) throw new NotFoundException('Category not found');

    return category;
  }

  async createCategory(data: CreateCategoryDto) {
    const gameExists = await this.prisma.games.findUnique({
      where: { game_id: data.game_id },
    });

    if (!gameExists) throw new NotFoundException('Game ID must exist');

    const category = await this.prisma.run_categories.create({
      data: {
        run_category_id: randomUUID(),
        game_id: data.game_id,
        run_category_name: data.run_category_name,
      },
    });

    return {
      message: 'Category successfully created',
      data: category,
    };
  }

  async updateCategory(
    run_category_id: string,
    data: UpdateCategoryDto,
  ) {
    await this.prisma.run_categories.update({
      where: { run_category_id },
      data,
    });

    return { message: 'Category successfully updated' };
  }

  async deleteCategory(run_category_id: string) {
    await this.prisma.run_categories.delete({
      where: { run_category_id },
    });

    return { message: 'Category successfully deleted' };
  }
}