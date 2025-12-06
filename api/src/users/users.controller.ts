import { UsersService } from './users.service';
import { Body, Controller, Get, Head, Header, Post } from '@nestjs/common';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Post()
     createUser(@Body() data: any) {
        return this.userService.createUser(data);
     }   
}
