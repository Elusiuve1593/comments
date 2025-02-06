import { Test, TestingModule } from '@nestjs/testing';

import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryService } from './cloudinary.service';

describe('CloudinaryService', () => {
  let service: CloudinaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CloudinaryService],
    }).compile();

    service = module.get<CloudinaryService>(CloudinaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should upload a file successfully', async () => {
    const mockUploadStream = jest
      .fn()
      .mockImplementation((options, callback) => {
        callback(null, { url: 'http://dummyurl.com' });
        return { end: jest.fn() };
      });

    cloudinary.uploader.upload_stream = mockUploadStream;

    const mockFile = {
      buffer: Buffer.from('dummy file data'),
    } as Express.Multer.File;

    const result: any = await service.uploadFile(mockFile);
    expect(result).toHaveProperty('url');
    expect(result.url).toBe('http://dummyurl.com');
    expect(mockUploadStream).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if upload fails', async () => {
    const mockUploadStream = jest
      .fn()
      .mockImplementation((options, callback) => {
        callback(new Error('Upload failed'), null);
        return { end: jest.fn() };
      });

    cloudinary.uploader.upload_stream = mockUploadStream;

    const mockFile = {
      buffer: Buffer.from('dummy file data'),
    } as Express.Multer.File;

    await expect(service.uploadFile(mockFile)).rejects.toThrowError(
      'Upload failed',
    );
    expect(mockUploadStream).toHaveBeenCalledTimes(1);
  });
});
