import { BadRequestException } from '@nestjs/common';
import { MAX_SIZE } from 'src/constants';

export const multerOptions = {
  limits: { fileSize: MAX_SIZE },
  fileFilter: (req: any, file: Express.Multer.File, cb: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg)$/)) {
      cb(null, true);
    } else {
      cb(new BadRequestException('Only JPG files are allowed!'), false);
    }
  },
};
