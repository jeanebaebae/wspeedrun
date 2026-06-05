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

    if (!vod_url || vod_url.trim() === '') {
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
      data: this.formatRun(run, category),
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

    const game = await this.getGameInfo(category.game_id);

    return runs.map((run) =>
      this.formatRun(run, category, game, {
        user_id: run.user_id,
      }),
    );
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

    return runs.map((run) => this.formatRun(run));
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

    const game = run.category ? await this.getGameInfo(run.category.game_id) : null;

    return {
      ...this.formatRun(run, run.category, game, {
        user_id: run.user_id,
      }),
      comments: run.comments,
    };
  }

  private formatRun(run: any, category?: any, game?: any, runner?: any) {
    return {
      run_id: run.run_id,
      run_category_id: run.run_category_id,
      user_id: run.user_id,
      vod_url: run.vod_url,
      run_duration: Number(run.run_duration),
      run_duration_formatted: this.formatDuration(Number(run.run_duration)),
      submitted_at: run.submitted_at,
      verified_at: run.verified_at,
      status: run.status,

      category: category
        ? {
            run_category_id: category.run_category_id,
            run_category_name: category.run_category_name,
            game_id: category.game_id,
          }
        : undefined,

      game: game || undefined,

      runner: runner || undefined,
    };
  }

  private async getGameInfo(gameId: string) {
    const gameServiceUrl = process.env.GAME_SERVICE_URL || 'http://localhost:3001';

    try {
      const response = await fetch(`${gameServiceUrl}/games/${gameId}`);

      if (!response.ok) {
        return {
          game_id: gameId,
          message: 'Game information unavailable',
        };
      }

      return await response.json();
    } catch {
      return {
        game_id: gameId,
        message: 'Game Service unavailable',
      };
    }
  }

    private formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, '0')} Hour(s) ` +
            `${minutes.toString().padStart(2, '0')} Minute(s) ` +
            `${secs.toString().padStart(2, '0')} Second(s)`;
    }
}