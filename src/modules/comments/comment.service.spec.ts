import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Comment } from './entity/comment.entity';
import { User } from '../user/entity/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException, HttpException } from '@nestjs/common';
import { CreateCommentDto } from './dto/comment.dto';

describe('CommentService', () => {
    let service: CommentService;
    let commentRepository: Repository<Comment>;
    let userRepository: Repository<User>;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          CommentService,
          {
            provide: getRepositoryToken(Comment),
            useClass: Repository,
          },
          {
            provide: getRepositoryToken(User),
            useClass: Repository,
          },
        ],
      }).compile();
  
      service = module.get<CommentService>(CommentService);
      commentRepository = module.get<Repository<Comment>>(getRepositoryToken(Comment));
      userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  
      // Мокування методів
      jest.spyOn(commentRepository, 'create').mockImplementation(() => ({}) as any);
      jest.spyOn(commentRepository, 'insert').mockResolvedValue(undefined);
      jest.spyOn(commentRepository, 'save').mockResolvedValue(undefined);
    });
  
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  
    describe('addComment', () => {
      it('should successfully add a comment', async () => {
        const createCommentDto: CreateCommentDto = {
          text: 'Test Comment',
          parentId: null,
        };
        const user = { email: 'test@example.com' } as User;
  
        const userEntity = { email: 'test@example.com', id: 1 } as User;
        jest.spyOn(userRepository, 'findOne').mockResolvedValue(userEntity);
  
        const mockInsert = jest.spyOn(commentRepository, 'insert').mockResolvedValue(undefined);
  
        await service.addComment(user, createCommentDto);
  
        expect(commentRepository.create).toHaveBeenCalledWith(expect.objectContaining({
          text: 'Test Comment',
          parentId: null,
          user: userEntity,
        }));
        expect(mockInsert).toHaveBeenCalled();
      });
    });
  
    describe('updateComment', () => {
        it('should update a comment if user owns the comment', async () => {
          const comment: any = { id: 1, text: 'Old text', user: { id: 1 } };
          jest.spyOn(commentRepository, 'findOne').mockResolvedValue(comment);
      
          await service.updateComment(
            { email: 'test@example.com', id: 1 } as User,
            1,
            { text: 'Updated text', parentId: null },
          );
        });
      });
      
  });
  
