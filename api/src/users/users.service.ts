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

  async update(id: string, data: any) {
    if (data.senha) {
      data.senha = await bcrypt.hash(data.senha, 10);
    }
    return this.userModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async remove(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
