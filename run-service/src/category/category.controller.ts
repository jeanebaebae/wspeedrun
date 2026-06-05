import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../admin/admin.guard';

@ApiTags('categories')
@Controller()
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }

    @Get('categories/:id')
    @ApiOperation({ summary: 'Get run category details' })
    @ApiResponse({ status: 200, description: 'Returns category details' })
    async getCategoryDetails(@Param('id') categoryId: string) {
        return this.categoryService.getCategoryDetails(categoryId);
    }

    @Post('admin/categories')
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create new run category (Admin only)' })
    @ApiResponse({ status: 201, description: 'Category created successfully' })
    async createCategory(@Body() createCategoryDto: any, @Req() req) {
        return this.categoryService.createCategory(createCategoryDto, req.user.role);
    }

    @Patch('admin/categories/:id/update')
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update run category (Admin only)' })
    @ApiResponse({ status: 200, description: 'Category updated successfully' })
    async updateCategory(@Param('id') categoryId: string, @Body() updateData: any, @Req() req) {
        return this.categoryService.updateCategory(categoryId, updateData, req.user.role);
    }

    @Delete('admin/categories/:id/delete')
    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete run category (Admin only)' })
    @ApiResponse({ status: 200, description: 'Category deleted successfully' })
    async deleteCategory(@Param('id') categoryId: string, @Req() req) {
        return this.categoryService.deleteCategory(categoryId, req.user.role);
    }
}