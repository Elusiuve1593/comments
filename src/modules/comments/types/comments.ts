import { Expose } from 'class-transformer';
import { Comment } from '../entity/comment.entity';

export class GetCommentsResponse {
  @Expose()
  data: Comment[];

  @Expose()
  total: number;

  @Expose()
  page: number;

  @Expose()
  totalPages: number;
}
