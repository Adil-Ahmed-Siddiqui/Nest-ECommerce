import { Module } from '@nestjs/common';
import { EmailService } from './email/email.service';
import { CryptoService } from './crypto/crypto.service';

@Module({
  providers: [EmailService, CryptoService],
  exports: [EmailService, CryptoService]
})
export class UtilsModule {}
