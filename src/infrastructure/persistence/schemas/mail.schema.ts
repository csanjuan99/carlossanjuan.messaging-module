import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MailDocument = HydratedDocument<Mail>;

class MailBody {
  @Prop({
    required: true,
  })
  message: string;
  @Prop({
    type: Date,
    default: Date.now,
  })
  createdAt: Date;
  @Prop({
    type: Date,
    default: Date.now,
  })
  updatedAt: Date;
  @Prop({
    required: true,
  })
  createdBy: string;
  @Prop({
    default: false,
  })
  read: boolean;
}

class Sender {
  @Prop({
    required: true,
  })
  id: string;
  @Prop({
    required: true,
  })
  email: string;
}

@Schema({
  timestamps: true,
  collection: 'mails',
})
export class Mail {
  @Prop({
    required: true,
  })
  from: Sender;
  @Prop({
    required: true,
  })
  to: Sender;
  @Prop({
    required: true,
  })
  subject: string;
  @Prop({
    required: true,
  })
  body: MailBody[];
}

export const MailSchema = SchemaFactory.createForClass(Mail);
