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
    return this.weatherModel.find().lean().exec();
  }

  async createCSV() {
    const data = await this.findAlldata();

    const header = "temperature_2m,relative_humidity_2m,createdAt";

    const formatRow = data.map(log => `${log.temperature_2m},${log.relative_humidity_2m},"${log.createdAt}"`);

    const rowCSV = formatRow.join('\n');

    const csvComplete = header + '\n' + rowCSV;

    return csvComplete

  }

  async getWeatherInsights() {

    const last5 = await this.weatherModel
      .find()
      .sort({createdAt: -1})
      .limit(5)
      .lean()
      .exec();

      if (last5.length === 0) {
        return "Sem dados suficientes para gerar os insights.";
      }

      let somaTotal = 0

      for (const temp of last5) {
        somaTotal += temp.temperature_2m;
      }
      const media = somaTotal / last5.length;

      if (media <= 15) {
        return "Tempo muito frio, melhor buscar seu agasalho."
      } else if (media <= 25) {
        return "Tempo agradável, para ler um livro na varanda."
      } else {
        return "Tempo quente, beba água e use protetor solar."
      }
  }
}