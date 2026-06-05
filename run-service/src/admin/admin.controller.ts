import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from './admin.guard';

@ApiTags('admin')
@Controller('admin')
@UseGuards(AuthGuard('jwt'), AdminGuard)
@ApiBearerAuth()
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('runs/:status')
    @ApiOperation({ summary: 'Get all run entries filtered by status (Admin only)' })
    @ApiResponse({ status: 200, description: 'Returns list of runs' })
    async getRunsByStatus(@Param('status') status: string) {
        return this.adminService.getRunsByStatus(status);
    }

    @Post('runs/:id/accept')
    @ApiOperation({ summary: 'Accept a run entry (Admin only)' })
    @ApiResponse({ status: 200, description: 'Run accepted successfully' })
    async acceptRun(@Param('id') runId: string) {
        return this.adminService.acceptRun(runId);
    }

    @Post('runs/:id/reject')
    @ApiOperation({ summary: 'Reject a run entry (Admin only)' })
    @ApiResponse({ status: 200, description: 'Run rejected successfully' })
    async rejectRun(@Param('id') runId: string) {
        return this.adminService.rejectRun(runId);
    }
}