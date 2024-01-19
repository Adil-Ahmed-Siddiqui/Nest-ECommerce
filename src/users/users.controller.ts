import {
    Body,
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Param,
    Query,
    NotFoundException,
    Session,
    UseGuards,
    UseInterceptors
  } from '@nestjs/common';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { User } from './users.entity';
import { CurrentUser } from './decorators/current-user.decorator';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { AuthGuard } from '../guards/auth.guard';

@Serialize(UserDto)
@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService
    ){}

    @Get('/')
    getAllUsers() {
        return this.usersService.getAllUsers();
    }

    // @UseInterceptors(CurrentUserInterceptor)
    @Get('/profile')
    myProfile(@CurrentUser() user: User){
        // console.log(user)
        return user
    }

    @Get('/:id')
    async getSingleUser(@Param('id') id: string) {
        return this.usersService.getSingleUser(Number(id))  
    }

    @Patch('/')
    async updateUser(@CurrentUser() user: User, @Body() body: UpdateUserDto, @Session() session: any){ 
        const updatedUser = await this.usersService.updateUser(Number(user.id), body)
        session.user = { id: user.id, name: user.name } // updating session due to name change
        return updatedUser
    }
}
