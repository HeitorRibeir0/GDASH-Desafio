import { Body, Controller, Get, Head, Header, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async createData(@Body() data: any) {
    return this.appService.createData(data);
  }
  
  @UseGuards(AuthGuard('jwt'))
  @Get('/api/weather/logs')
  async findAlldata() {
    return this.appService.findAlldata();
  }

  @Get('/api/weather/export/csv')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment;filename="weather_data.csv"')
  async createCSV() {
    return this.appService.createCSV();
  }

  @Get('/api/weather/insights')
  async getInsights() {
    return this.appService.getWeatherInsights();
  }
}
