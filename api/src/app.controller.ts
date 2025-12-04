import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async createData(@Body() data: any) {
    return this.appService.createData(data);
  }

  @Get('/api/weather/logs')
  async findAlldata() {
    return this.appService.findAlldata();
  }
}
