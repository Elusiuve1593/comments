import { User } from 'src/modules/User/entity/User.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column({ nullable: true })
  parentId: number;

  @ManyToOne(() => User, (user) => user.comments, { eager: true })
  user: User;
}
