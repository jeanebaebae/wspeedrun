import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@ApiTags('categories')
@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('categories/:id')
  @ApiOperation({ summary: 'Get run category details' })
  @ApiResponse({ status: 200, description: 'Run category details' })
  async getCategoryDetails(@Param('id') categoryId: string) {
    return this.categoryService.getCategoryDetails(categoryId);
  }

  @Post('admin/categories')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new run category (Admin only)' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  async createCategory(@Req() req: any, @Body() createCategoryDto: CreateCategoryDto) {
    const role = req.user?.role;

    return this.categoryService.createCategory(createCategoryDto, role);
  }

  @Patch('admin/categories/:id/update')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update run category (Admin only)' })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  async updateCategory(
    @Param('id') categoryId: string,
    @Req() req: any,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const role = req.user?.role;

    return this.categoryService.updateCategory(categoryId, updateCategoryDto, role);
  }

  @Delete('admin/categories/:id/delete')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete run category (Admin only)' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  async deleteCategory(@Param('id') categoryId: string, @Req() req: any) {
    const role = req.user?.role;

    return this.categoryService.deleteCategory(categoryId, role);
  }
}