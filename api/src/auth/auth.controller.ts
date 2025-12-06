import { Controller, Post, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from '@nestjs/common';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(AuthGuard('local')) 
    @Post('login')
    async login(@Request() req) { 
        return this.authService.authLogin(req.user); 
    }
}
