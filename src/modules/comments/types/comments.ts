import { Expose } from 'class-transformer';
import { Comment } from '../entity/Comment.entity';

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
