import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
import { multerOptions } from './multer-options';
import { JwtAuthGuard } from '../user/jwt-auth.guard';

@Controller('image')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  uploadImage(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.cloudinaryService.uploadFile(file);
  }
}
