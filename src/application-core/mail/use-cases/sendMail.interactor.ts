import { Injectable, NotFoundException } from '@nestjs/common';
import { MailGateway } from '../../../infrastructure/persistence/gateways/mail.gateway';
import { MailDocument } from '../../../infrastructure/persistence/schemas/mail.schema';

@Injectable()
export class SendMailInteractor {
  constructor(private readonly mailGateway: MailGateway) {}

  async execute(payload: {
    mailId: string;
    message: string;
    createdBy: string;
  }): Promise<any> {
    const mail: MailDocument = await this.mailGateway.findById(payload.mailId);
    if (!mail) {
      throw new NotFoundException('Mail not found');
    }
    return this.mailGateway.updateById(payload.mailId, {
      updatedAt: new Date(),
      $addToSet: {
        body: {
          message: payload.message,
          createdBy: payload.createdBy,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    });
  }
}
