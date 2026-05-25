// game.controller.ts
import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { Roles } from './auth/roles.decorator'; 

@Controller()
export class GameController {
  constructor(private readonly gameService: GameService) {}

 

  @Get('games')
  getAllGames() {
    return this.gameService.getAllGames();
  }

  @Get('games/:id')
  getGameDetails(@Param('id') id: string) {
    return this.gameService.getGameDetails(id);
  }

  @Get('categories/:id')
  getCategoryDetails(@Param('id') id: string) {
    return this.gameService.getCategoryDetails(id);
  }

  

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('admin/games')
  createGame(@Body() createGameDto: CreateGameDto) {
    return this.gameService.createGame(createGameDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('admin/games/:id/update')
  updateGame(@Param('id') id: string, @Body() updateGameDto: Partial<CreateGameDto>) {
    return this.gameService.updateGame(id, updateGameDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete('admin/games/:id/delete')
  deleteGame(@Param('id') id: string) {
    return this.gameService.deleteGame(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('admin/categories')
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.gameService.createCategory(createCategoryDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('admin/categories/:id/update')
  updateCategory(@Param('id') id: string, @Body() updateCategoryDto: Partial<CreateCategoryDto>) {
    return this.gameService.updateCategory(id, updateCategoryDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete('admin/categories/:id/delete')
  deleteCategory(@Param('id') id: string) {
    return this.gameService.deleteCategory(id);
  }
}