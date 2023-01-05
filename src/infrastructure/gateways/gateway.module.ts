import { ExceptionsModule } from '@infrastructure/services/exceptions/exceptions.module';
import { LoggerModule } from '@infrastructure/services/logger/logger.module';
import { UseCasesProxyModule } from '@infrastructure/usercases-proxy/usecases-proxy.module';
import { Module } from '@nestjs/common';
import { ChatGateway } from './base/chat.gateway';

@Module({
  imports: [UseCasesProxyModule.register(), ExceptionsModule, LoggerModule],
  providers: [ChatGateway],
  exports: [ChatGateway],
})
export class GatewayModule {}
