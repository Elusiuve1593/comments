import { Comment } from 'src/modules/Comments/entity/Comment.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ type: 'simple-array', nullable: true })
  blacklistedTokens: string[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}
