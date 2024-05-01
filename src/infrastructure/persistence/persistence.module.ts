import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Mail, MailSchema } from './schemas/mail.schema';
import { MailGateway } from './gateways/mail.gateway';

const SERVICES = [MailGateway];

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Mail.name,
        schema: MailSchema,
      },
    ]),
  ],
  providers: [...SERVICES],
  exports: [...SERVICES],
})
export class PersistenceModule {}
