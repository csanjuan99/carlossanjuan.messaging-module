import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { GetMailInteractor } from './mail/use-cases/getMail.interactor';
import { GetMailsInteractor } from './mail/use-cases/getMails.interactor';
import { SendMailInteractor } from './mail/use-cases/sendMail.interactor';
import { CreateMailInteractor } from './mail/use-cases/createMail.interactor';

const SERVICES = [
  GetMailInteractor,
  GetMailsInteractor,
  SendMailInteractor,
  CreateMailInteractor,
];

@Module({
  imports: [
    InfrastructureModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('security.jwt.secret'),
        signOptions: {
          expiresIn: configService.get('security.jwt.expiresIn'),
        },
      }),
    }),
  ],
  providers: [...SERVICES],
  exports: [...SERVICES],
})
export class ApplicationCoreModule {}
