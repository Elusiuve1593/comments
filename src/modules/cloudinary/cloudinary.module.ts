import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryService } from './cloudinary.service';

@Module({
  imports: [],
  controllers: [CloudinaryController],
  providers: [CloudinaryProvider, CloudinaryService, JwtService],
})
export class CloudinaryModule {}
