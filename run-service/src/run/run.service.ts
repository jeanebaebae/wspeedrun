import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRunDto } from '../dto/create-run.dto';

@Injectable()
export class RunService {
  constructor(private readonly prisma: PrismaService) {}

  async createRun(userId: string, createRunDto: CreateRunDto) {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    const { run_category_id, vod_url, run_duration } = createRunDto;

    if (!run_category_id) {
      throw new BadRequestException('Run category ID is required');
    }

    if (!vod_url) {
      throw new BadRequestException('VOD URL is required');
    }

    if (run_duration === undefined || run_duration === null) {
      throw new BadRequestException('Run duration is required');
    }

    const durationNumber = Number(run_duration);

    if (Number.isNaN(durationNumber) || durationNumber <= 0) {
      throw new BadRequestException('Run duration must be a positive number');
    }

    const category = await this.prisma.runCategory.findUnique({
      where: {
        run_category_id,
      },
    });

    if (!category) {
      throw new NotFoundException('Run category not found');
    }

    const run = await this.prisma.run.create({
      data: {
        run_category_id,
        user_id: userId,
        vod_url,
        run_duration: BigInt(durationNumber),
        status: 'PENDING',
      },
    });

    return {
      message: 'Run entry created successfully',
      data: {
        ...run,
        run_duration: Number(run.run_duration),
        run_duration_formatted: this.formatDuration(Number(run.run_duration)),
      },
    };
  }

  async getRunsByCategory(categoryId: string) {
    if (!categoryId) {
      throw new BadRequestException('Category ID is required');
    }

    const category = await this.prisma.runCategory.findUnique({
      where: {
        run_category_id: categoryId,
      },
    });

    if (!category) {
      throw new NotFoundException('Run category not found');
    }

    const runs = await this.prisma.run.findMany({
      where: {
        run_category_id: categoryId,
        status: 'ACCEPTED',
      },
      orderBy: {
        run_duration: 'asc',
      },
    });

    return runs.map((run) => ({
      ...run,
      run_duration: Number(run.run_duration),
      run_duration_formatted: this.formatDuration(Number(run.run_duration)),
    }));
  }

  async getRunsByUser(requestedUserId: string, authenticatedUserId: string) {
    if (!requestedUserId) {
      throw new BadRequestException('User ID is required');
    }

    if (!authenticatedUserId) {
      throw new BadRequestException('Authenticated user ID is required');
    }

    const whereClause: any = {
      user_id: requestedUserId,
    };

    if (requestedUserId !== authenticatedUserId) {
      whereClause.status = 'ACCEPTED';
    }

    const runs = await this.prisma.run.findMany({
      where: whereClause,
      orderBy: {
        submitted_at: 'desc',
      },
    });

    return runs.map((run) => ({
      ...run,
      run_duration: Number(run.run_duration),
      run_duration_formatted: this.formatDuration(Number(run.run_duration)),
    }));
  }

  async getRunDetails(runId: string) {
    if (!runId) {
      throw new BadRequestException('Run ID is required');
    }

    const run = await this.prisma.run.findUnique({
      where: {
        run_id: runId,
      },
      include: {
        category: true,
        comments: {
          orderBy: {
            created_at: 'desc',
          },
        },
      },
    });

    if (!run) {
      throw new NotFoundException('Run not found');
    }

    return {
      ...run,
      run_duration: Number(run.run_duration),
      run_duration_formatted: this.formatDuration(Number(run.run_duration)),
    };
  }

  private formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours} Hour(s) ${minutes} Minute(s) ${secs} Second(s)`;
  }
}