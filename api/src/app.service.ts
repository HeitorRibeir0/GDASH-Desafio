import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Weather, WeatherDocument } from './schema/weather.schema';

@Injectable()
export class AppService {

    constructor(
    @InjectModel(Weather.name) private weatherModel: Model<WeatherDocument>
  ) {}

  async createTest() {
    return this.weatherModel.create({
      temperature_2m:25.5,
      weather_code: 1,
      relative_humidity_2m: 60
    });
  }

  getHello(): string {
    return 'Hello World!';
  }
}