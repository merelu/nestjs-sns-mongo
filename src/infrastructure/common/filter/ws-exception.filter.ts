import { CommonErrorCodeEnum } from '@domain/common/enums/error-code.enum';
import { IFormatExceptionMessage } from '@domain/exceptions/exceptions.interface';
import { LoggerService } from '@infrastructure/services/logger/logger.service';
import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { AuthenticatedSocket } from '../adapter/redis-io.adapter';

@Catch()
export class WsExceptionFilter extends BaseWsExceptionFilter {
  constructor(private readonly logger: LoggerService) {
    super();
  }
  catch(exception: any, host: ArgumentsHost) {
    const client = host.switchToWs().getClient() as AuthenticatedSocket;

    const result =
      exception instanceof HttpException && exception instanceof WsException
        ? (exception.getResponse() as IFormatExceptionMessage)
        : ({
            error_description: (exception as Error).message,
            error_text: '',
            error_code: CommonErrorCodeEnum.INTERNAL_SERVER,
          } as IFormatExceptionMessage);

    this.logMessage(result, exception);

    client.emit('exception', result);
  }

  private logMessage(result: IFormatExceptionMessage, exception: any) {
    this.logger.error(
      `Socket Error`,
      `error_code=${result.error_code} message=${result.error_description}`,
      exception.stack,
    );
  }
}
