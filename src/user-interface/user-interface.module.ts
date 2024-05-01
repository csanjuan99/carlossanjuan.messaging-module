import { Module } from '@nestjs/common';
import { ApplicationCoreModule } from '../application-core/application-core.module';

@Module({
  imports: [ApplicationCoreModule],
  controllers: [],
})
export class UserInterfaceModule {}
