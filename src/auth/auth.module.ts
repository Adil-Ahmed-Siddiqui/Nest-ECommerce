import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [UsersModule, UtilsModule]
})
export class AuthModule {}
