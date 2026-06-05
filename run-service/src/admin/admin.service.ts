import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getRunsByStatus(status: string) {
    const validStatuses = ['PENDING', 'ACCEPTED', 'REJECTED'];

    if (!validStatuses.includes(status)) {
      throw new ForbiddenException(
        'Invalid status. Must be PENDING, ACCEPTED, or REJECTED',
      );
    }

    const runs = await this.prisma.run.findMany({
      where: {
        status,
      },
      orderBy: {
        submitted_at: 'desc',
      },
    });

    return runs.map((run) => this.formatRun(run));
  }

  async acceptRun(runId: string) {
    const run = await this.prisma.run.findUnique({
      where: {
        run_id: runId,
      },
    });

    if (!run) {
      throw new NotFoundException('Run not found');
    }

    const updatedRun = await this.prisma.run.update({
      where: {
        run_id: runId,
      },
      data: {
        status: 'ACCEPTED',
        verified_at: new Date(),
      },
    });

    return {
      message: 'Run accepted successfully',
      data: this.formatRun(updatedRun),
    };
  }

  async rejectRun(runId: string) {
    const run = await this.prisma.run.findUnique({
      where: {
        run_id: runId,
      },
    });

    if (!run) {
      throw new NotFoundException('Run not found');
    }

    const updatedRun = await this.prisma.run.update({
      where: {
        run_id: runId,
      },
      data: {
        status: 'REJECTED',
        verified_at: new Date(),
      },
    });

    return {
      message: 'Run rejected successfully',
      data: this.formatRun(updatedRun),
    };
  }

  private formatRun(run: any) {
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