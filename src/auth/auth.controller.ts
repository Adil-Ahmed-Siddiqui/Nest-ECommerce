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

import { AuthService } from './auth.service';
import { RegisterUserDto } from './dtos/register-user.dto';
import { VerifyEmailDto } from './dtos/verify-email.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/users.entity';
import { CurrentUserInterceptor } from 'src/users/interceptors/current-user.interceptor';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ){}

    @Post('/register')
    registerUser(@Body() body: RegisterUserDto){
        return this.authService.registerUser(body)
    }

    @Post('/verify-email')
    verifyEmail(@Body() body: VerifyEmailDto){
        return this.authService.verifyEmail(body)
    }

    @Post('/login')
    async loginUser(@Body() body: LoginUserDto, @Session() session: any){
        const user = await this.authService.loginUser(body)
        session.user = { id: user.id, name: user.name }
        return session.user
    }

    @Post('/logout')
    logoutUser(@Session() session: any){
        session.user = null;
        return { msg: 'Logged out!' }
    }

    // @UseInterceptors(CurrentUserInterceptor)
    @Post('/forgot-password')
    forgotPassword(@Body() body: ForgotPasswordDto, @CurrentUser() user: User){
        // console.log(user)
        return this.authService.forgotPassword(body)
    }

    @Post('/reset-password')
    resetPassword(@Body() body: ResetPasswordDto){
        return this.authService.resetPassword(body)
    }
}
