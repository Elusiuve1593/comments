import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('HOST'),
        port: 5432,
        username: configService.get<string>('USER'),
        password: configService.get<string>('PASSWORD'),
        database: configService.get<string>('DB'),
        synchronize: true,
        autoLoadEntities: true,
        timezone: 'Europe/Kiev',
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [ConfigModule, TypeOrmModule],
})
export class DatabaseConfigureModule {}
