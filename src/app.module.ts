import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserInterfaceModule } from './user-interface/user-interface.module';
import DatabaseConfig from './common/config/database.config';
import SecurityConfig from './common/config/security.config';
import { APP_GUARD } from '@nestjs/core';
import { MessageModule } from './common/modules/message/message.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [SecurityConfig, DatabaseConfig],
    }),
    UserInterfaceModule,
    MessageModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
