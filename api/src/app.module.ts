import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Weather, WeatherSchema } from './schema/weather.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/weather_db'),

    MongooseModule.forFeature([
      {
        name: Weather.name,
        schema:WeatherSchema
      }
    ]
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
