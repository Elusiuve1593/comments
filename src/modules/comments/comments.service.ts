import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entity/comment.entity';
import { CreateCommentDto } from './dto/comment.dto';
import { User } from '../user/entity/user.entity';
import { plainToClass } from 'class-transformer';
import { GetCommentsResponse } from './types/comments';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async addComment(user: User, body: CreateCommentDto) {
    const { text, parentId } = body;

    const userEntity = await this.userRepository.findOne({
      where: { email: user.email },
    });

    const comment = this.commentRepository.create({
      text,
      parentId,
      user: userEntity,
    });
    await this.commentRepository.insert(comment);
  }

  async getComments(page: number, limit: number): Promise<GetCommentsResponse> {
    const [comments, total] = await this.commentRepository.findAndCount({
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
      relations: ['user'],
    });

    const comment = {
      data: comments,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };

    return plainToClass(GetCommentsResponse, comment);
  }

  async getCommentById(id: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return plainToClass(Comment, comment);
  }

  async updateComment(user: User, id: number, body: CreateCommentDto) {
    const { text, parentId } = body;

    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.user.id !== user.id) {
      throw new HttpException('You are not allowed to edit this comment', 500);
    }

    comment.text = text;
    comment.parentId = parentId;
  }
}