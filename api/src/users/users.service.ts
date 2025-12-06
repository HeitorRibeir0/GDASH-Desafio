import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schema/user.schema';
import * as bcrypt from 'bcryptjs'

@Injectable()
export class UsersService {

    constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {}

    async createUser(data: any) {
        const hash = await bcrypt.hash(data.senha,10);
        data.senha = hash
        return this.userModel.create(data)
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({email: email}).exec();
    }
}
