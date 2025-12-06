import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({timestamps: true})
export class User {

    @Prop()
    name: string;

    @Prop({unique: true})
    email: string;

    @Prop()
    senha: string;
}

export const UserSchema = SchemaFactory.createForClass(User)