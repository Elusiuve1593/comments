import { DatabaseConfigureModule } from './db/db-config.module';
import { AuthModule } from './modules/User/auth.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseConfigureModule, AuthModule],
})
export class AppModule {}
