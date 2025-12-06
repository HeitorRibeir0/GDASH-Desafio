import { Injectable } from '@nestjs/common';
import {UsersService} from 'src/users/users.service'
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { access } from 'fs';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService, 
        private readonly jwtService: JwtService) {}
    

    async validateUser(email: string, passwrd: string): Promise<any> {
        const user = await this.userService.findByEmail(email);
        if (user && await bcrypt.compare(passwrd, user.senha)) {
            return user;
        }
        return null;
    }

    async authLogin(user: any) {
        const payload = {username: user.email, sub: user._id};
        return {
            access_token: this.jwtService.sign(payload),
        };
    }


}
