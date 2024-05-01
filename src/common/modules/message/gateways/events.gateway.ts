import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SendMailInteractor } from '../../../../application-core/mail/use-cases/sendMail.interactor';
import { GetMailsInteractor } from '../../../../application-core/mail/use-cases/getMails.interactor';
import { verify } from 'jsonwebtoken';
import { CreateMailInteractor } from '../../../../application-core/mail/use-cases/createMail.interactor';

@WebSocketGateway({
  transports: ['websocket'],
  namespace: 'messages',
  cors: {
    origin: [
      'carlossanjuan.co',
      'https://carlossanjuan.co',
      'https://www.carlossanjuan.co',
    ],
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private clients: Map<number, string[]> = new Map<number, string[]>();

  constructor(
    private readonly sendMailInteractor: SendMailInteractor,
    private readonly getMailsInteractor: GetMailsInteractor,
    private readonly createMailInteractor: CreateMailInteractor,
  ) {}

  handleConnection(client: Socket) {
    const user = this.validateAndGetUser(client);
    if (user) {
      const existing: string[] = this.clients.get(user.id) || [];
      existing.push(client.id);
      this.clients.set(user.id, existing);
    }
  }

  handleDisconnect(client: Socket): void {
    const user = this.validateAndGetUser(client);
    if (user) {
      const existing: string[] = this.clients.get(user.id) || [];
      const index: number = existing.indexOf(client.id);
      if (index !== -1) {
        existing.splice(index, 1);
        if (existing.length > 0) {
          this.clients.set(user.id, existing);
        } else {
          this.clients.delete(user.id);
        }
      }
    }
  }

  validateAndGetUser(client: Socket): any {
    const access_token: string = client.handshake.auth.access_token;
    if (!access_token) {
      return;
    }
    return verify(access_token, process.env.JWT_SECRET);
  }

  @SubscribeMessage('send.mail.message')
  async sendMessage(
    @MessageBody()
    payload: {
      message: string;
      mailId: string;
      sender: string;
      receiver: number;
    },
  ): Promise<void> {
    const mail = await this.sendMailInteractor.execute({
      mailId: payload.mailId,
      message: payload.message,
      createdBy: payload.sender,
    });

    const recipientSockets: string[] = this.clients.get(payload.receiver);
    if (recipientSockets) {
      recipientSockets.forEach((socketId: string): void => {
        this.server.to(socketId).emit('send.mail.message', mail);
      });
    }
    return mail;
  }

  @SubscribeMessage('send.mail')
  async sendMail(@MessageBody() payload: any) {
    const mail = await this.createMailInteractor.execute(payload);
    const recipientSockets: string[] = this.clients.get(payload.to.id);
    if (recipientSockets) {
      recipientSockets.forEach((socketId: string): void => {
        this.server.to(socketId).emit('send.mail', mail);
      });
    }
    return mail;
  }

  @SubscribeMessage('get.mails')
  async getMails(
    @MessageBody() receiver: { email: string; id: number },
    @ConnectedSocket() client: any,
  ): Promise<void> {
    const mails = await this.getMailsInteractor.execute(receiver);
    client.emit('get.mails', mails);
  }
}
