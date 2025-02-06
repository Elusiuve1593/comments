import { Controller, Get, HttpCode } from '@nestjs/common';

@Controller('health-check')
export class HealthCheck {
  @HttpCode(200)
  @Get()
  async getCommentById() {
    return 'Ok';
  }
}
