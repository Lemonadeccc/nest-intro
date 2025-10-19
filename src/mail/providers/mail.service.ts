import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/user.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailService: MailerService) {}

  public async sendUserWelcome(user: User): Promise<void> {
    await this.mailService.sendMail({
      to: user.email,
      from: `Onboard Team <support@nestjs-bloog.com>`,
      subject: 'Welcome to NestJS Blog',
      template: './welcome',
      context: {
        name: user.firstName,
        email: user.email,
        loginUrl: 'http://localhost:3000',
      },
    });
  }
}
