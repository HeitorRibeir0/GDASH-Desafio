import { Body, Controller, Post, Get, Patch, Delete, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  createUser(@Body() data: any) {
    return this.userService.createUser(data);
  }


  @UseGuards(AuthGuard('jwt')) 
  @Patch(':id') 
  update(@Param('id') id: string, @Body() data: any) {
    return this.userService.update(id, data);
  }

  @UseGuards(AuthGuard('jwt')) 
  @Delete(':id') 
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}