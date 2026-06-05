import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new comment in a specific run' })
  @ApiResponse({ status: 201, description: 'Comment created successfully' })
  async createComment(@Req() req: any, @Body() createCommentDto: CreateCommentDto) {
    const userId = req.user?.user_id || req.user?.id || req.user?.sub;

    return this.commentService.createComment(userId, createCommentDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete comment' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  async deleteComment(@Param('id') commentId: string, @Req() req: any) {
    const userId = req.user?.user_id || req.user?.id || req.user?.sub;

    return this.commentService.deleteComment(commentId, userId);
  }
}