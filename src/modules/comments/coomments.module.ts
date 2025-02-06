import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entity/Comment.entity';
import { CommentService } from './comments.service';
import { CommentController } from './comments.controller';
import { User } from '../user/entity/User.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User])],
  providers: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {}
