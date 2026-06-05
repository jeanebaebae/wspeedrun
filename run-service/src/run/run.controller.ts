import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RunService } from './run.service';
import { CreateRunDto } from '../dto/create-run.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('runs')
@Controller('runs')
export class RunController {
  constructor(private readonly runService: RunService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new run entry' })
  async createRun(@Req() req: any, @Body() createRunDto: CreateRunDto) {
    const user = req.user;

    const userId = user?.user_id || user?.id || user?.sub;

    return this.runService.createRun(userId, createRunDto);
  }

  @Get(':id/category')
  @ApiOperation({ summary: 'Get all runs by run category' })
  async getRunsByCategory(@Param('id') categoryId: string) {
    return this.runService.getRunsByCategory(categoryId);
  }

  @Get(':id/user')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all runs by user' })
  async getRunsByUser(@Param('id') requestedUserId: string, @Req() req: any) {
    const user = req.user;

    const authenticatedUserId = user?.user_id || user?.id || user?.sub;

    return this.runService.getRunsByUser(requestedUserId, authenticatedUserId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get run details' })
  async getRunDetails(@Param('id') runId: string) {
    return this.runService.getRunDetails(runId);
  }
}