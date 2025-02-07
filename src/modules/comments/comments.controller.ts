import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Param,
  ParseIntPipe,
  Query,
  Put,
  Delete,
} from '@nestjs/common';
import { CommentService } from './comments.service';
import { CreateCommentDto } from './dto/comment.dto';
import { JwtAuthGuard } from '../user/jwt-auth.guard';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async addComment(@Request() req, @Body() body: CreateCommentDto) {
    return this.commentService.addComment(req.user, body);
  }

  @Get()
  async getComments(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 25,
  ) {
    return this.commentService.getComments(page, limit);
  }

  @Get(':id')
  async getCommentById(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.getCommentById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateComment(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateCommentDto,
  ) {
    return this.commentService.updateComment(req.user, id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteComment(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.deleteComment(id);
  }
}
