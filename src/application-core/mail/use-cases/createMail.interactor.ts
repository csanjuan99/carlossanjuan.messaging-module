import { Injectable } from '@nestjs/common';
import { MailGateway } from '../../../infrastructure/persistence/gateways/mail.gateway';

@Injectable()
export class CreateMailInteractor {
  constructor(private readonly mailGateway: MailGateway) {}

  async execute(payload: any): Promise<any> {
    return this.mailGateway.create(payload);
  }
}
