import { Injectable, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Weather, WeatherDocument } from './schema/weather.schema';

@Injectable()
export class AppService {

    constructor(
    @InjectModel(Weather.name) private weatherModel: Model<WeatherDocument>
  ) {}

  async createData(data: any) {
    console.log('Api recebeu:', data.current);
    return this.weatherModel.create(data.current);
  }

  async findAlldata() {
    return this.weatherModel.find().exec();
  }
}