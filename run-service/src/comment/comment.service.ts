import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from '../dto/create-comment.dto';

@Injectable()
export class CommentService {
    constructor(private prisma: PrismaService) { }

    async createComment(authenticatedUserId: string, createCommentDto: CreateCommentDto) {
        
        if (!createCommentDto.run_id) {
            throw new BadRequestException('Run ID is required');
        }
        if (!createCommentDto.user_id) {
            throw new BadRequestException('User ID is required');
        }
        if (!createCommentDto.comment || createCommentDto.comment.trim() === '') {
            throw new BadRequestException('Comment cannot be empty');
        }

        if (authenticatedUserId !== createCommentDto.user_id) {
            throw new ForbiddenException('User ID does not match authenticated user');
        }

        const run = await this.prisma.run.findUnique({
            where: { run_id: createCommentDto.run_id },
        });

        if (!run) {
            throw new NotFoundException('Run not found');
        }

        const runId = createCommentDto.run_id;
        const userId = createCommentDto.user_id;
        const commentText = createCommentDto.comment;

        const comment = await this.prisma.comment.create({
            data: {
                run_id: runId,
                user_id: userId,
                comment: commentText,
            },
        });

        return {
            message: 'Comment created successfully',
            comment_id: comment.comment_id,
        };
    }

    async deleteComment(commentId: string, authenticatedUserId: string) {
        if (!commentId) {
            throw new BadRequestException('Comment ID is required');
        }

        const comment = await this.prisma.comment.findUnique({
            where: { comment_id: commentId },
        });

        if (!comment) {
            throw new NotFoundException('Comment not found');
        }

        if (comment.user_id !== authenticatedUserId) {
            throw new ForbiddenException('You can only delete your own comments');
        }

        await this.prisma.comment.delete({
            where: { comment_id: commentId },
        });

        return { message: 'Comment deleted successfully' };
    }
}