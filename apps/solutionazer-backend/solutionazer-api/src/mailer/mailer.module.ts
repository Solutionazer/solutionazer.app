import { Module } from '@nestjs/common';
import { MailerService } from './services/mailer.service';
import { MailerClient } from './services/mailer-client.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResetPasswordToken } from './entities/password-reset-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ResetPasswordToken])],
  providers: [
    {
      provide: MailerService,
      useClass: MailerService,
    },
    {
      provide: MailerClient,
      useClass: MailerClient,
    },
  ],
  exports: [MailerService, TypeOrmModule],
})
export class MailerModule {}
