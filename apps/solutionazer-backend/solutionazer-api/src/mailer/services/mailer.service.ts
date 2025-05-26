import { Injectable } from '@nestjs/common';
import { MailerClient } from './mailer-client.service';

@Injectable()
export class MailerService {
  constructor(private readonly mailerClient: MailerClient) {}

  sendMail(to: string, subject: string, body: string) {
    return this.mailerClient.send(to, subject, body);
  }
}
