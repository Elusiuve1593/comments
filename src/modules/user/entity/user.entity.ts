import { Exclude } from 'class-transformer';
import { Comment } from '../../comments/entity/comment.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;
  
  @Column()
  avatar: string;

  @Column()
  username: string;

  @Exclude()
  @Column()
  password: string;

  @Exclude()
  @Column({ type: 'simple-array', nullable: true })
  blacklistedTokens: string[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}
