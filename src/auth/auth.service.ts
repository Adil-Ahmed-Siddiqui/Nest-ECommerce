import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/users.entity';
import { EmailService } from 'src/utils/email/email.service';
import { CryptoService } from 'src/utils/crypto/crypto.service';
const crypto = require('crypto');

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private emailService: EmailService,
        private cryptoService: CryptoService
    ){}

    async registerUser(body: Partial<User>){
        const { email, name } = body;

        const isFirstAccount = (await this.usersService.getAllUsers()).length === 0
        const role = isFirstAccount ? 'admin' : 'user'

        const verificationToken = crypto.randomBytes(40).toString('hex');
  
        const password = await this.cryptoService.hashPassword(body.password)
        const user = await this.usersService.createUser({ email, name, password, role, verificationToken })

        const origin = 'http://localhost:5000'; // Redirect to frontend

        await this.emailService.sendVerificationEmail({
            name: user.name,
            email: user.email,
            verificationToken: user.verificationToken,
            origin,
        });

        return { msg: 'Success! Please check your email to verify account' }
    }

    async verifyEmail(body: Partial<User>){
        const { verificationToken, email } = body;
        const user = await this.usersService.findByEmail(email, false);
      
        if (user.verificationToken !== verificationToken) {
          throw new BadRequestException('Verification Failed');
        }
      
        user.isVerified = true 
        user.verified = new Date()
        user.verificationToken = ''
      
        await this.usersService.updateUser(user.id, user);
      
        return { msg: 'Email Verified' }
    };

    async loginUser(body: Partial<User>){
        const { email, password } = body;
      
        const user = await this.usersService.findByEmail( email, false );
        
        const isPasswordCorrect = await this.cryptoService.comparePassword(password, user.password);

        if (!isPasswordCorrect) {
          throw new BadRequestException('Invalid Credentials');
        }
        if (!user.isVerified) {
          throw new UnauthorizedException('Please verify your email');
        }
      
        return user
    };

    async forgotPassword(body: Partial<User>){
        const { email } = body;
      
        const user = await this.usersService.findByEmail( email, false );

        const passwordToken = crypto.randomBytes(70).toString('hex');
        const origin = 'http://localhost:5000'; // Redirect to frontend

        await this.emailService.sendResetPasswordEmail({
            name: user.name,
            email: user.email,
            token: passwordToken,
            origin,
        });
            
        const tenMinutes = 1000 * 60 * 10;
        const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);
    
        user.passwordToken = this.cryptoService.hashString(passwordToken);
        user.passwordTokenExpirationDate = passwordTokenExpirationDate;

        this.usersService.updateUser(user.id, user)
      
        return { msg: 'Please check your email for reset password link' }
    };

    async resetPassword(body: Partial<User>){
        const { email, password, passwordToken } = body;
      
        const user = await this.usersService.findByEmail( email, false );

        const currentDate = new Date();

        if (user.passwordToken === this.cryptoService.hashString(passwordToken) && user.passwordTokenExpirationDate > currentDate) {
            user.password = await this.cryptoService.hashPassword(password)
            user.passwordToken = null;
            user.passwordTokenExpirationDate = null;
            await this.usersService.updateUser(user.id, user);
        }
        else{
            throw new BadRequestException('Reset Password Token expired!');
        }

        return { msg: 'Password changed' }
    };
}
