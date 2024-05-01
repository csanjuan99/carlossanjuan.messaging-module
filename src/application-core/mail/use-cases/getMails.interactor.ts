import { Injectable } from '@nestjs/common';
import { MailGateway } from '../../../infrastructure/persistence/gateways/mail.gateway';
import { MailDocument } from '../../../infrastructure/persistence/schemas/mail.schema';

@Injectable()
export class GetMailsInteractor {
  constructor(private readonly mailGateway: MailGateway) {}

  async execute(payload: any, projection?: any): Promise<any> {
    const mails: MailDocument[] = await this.mailGateway.findAll(
      {
        $or: [
          {
            'from.email': payload.receiver.email,
          },
          {
            'to.email': payload.receiver.email,
          },
        ],
      },
      projection,
      {
        sortBy: 'updatedAt',
        order: 'desc',
      },
    );
    mails.filter((mail: MailDocument): MailDocument => {
      if (mail.body.at(-1).createdBy === payload.receiver.email) {
        return mail;
      }
      if (
        mail.body.some(
          (message): boolean => message.createdBy !== payload.receiver.email,
        )
      ) {
        return mail;
      }
    });
    if (!mails[0]) {
      return [];
    }
    return mails;
  }
}
