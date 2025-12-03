import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type WeatherDocument = HydratedDocument<Weather>;

@Schema({ timestamps: true})
export class Weather {

    @Prop()
    temperature_2m: number;

    @Prop()
    weather_code: number;

    @Prop()
    relative_humidity_2m: number;

    @Prop()
    wind_speed_10m: number;

    @Prop()
    rain: number;

    @Prop()
    showers: number;

    @Prop()
    precipitation: number;

}

export const WeatherSchema = SchemaFactory.createForClass(Weather)