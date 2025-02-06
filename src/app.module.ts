import { DatabaseConfigureModule } from './db/db-config.module';
import { HealthCheck } from './health-check.controller';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { CommentModule } from './modules/comments/coomments.module';
import { AuthModule } from './modules/user/auth.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    DatabaseConfigureModule,
    AuthModule,
    CommentModule,
    CloudinaryModule,
  ],
  controllers: [HealthCheck]
})
export class AppModule {}
