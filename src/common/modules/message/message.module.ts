import { Module } from '@nestjs/common';
import { EventsGateway } from './gateways/events.gateway';
import { ApplicationCoreModule } from '../../../application-core/application-core.module';

@Module({
  imports: [ApplicationCoreModule],
  providers: [EventsGateway],
})
export class MessageModule {}
