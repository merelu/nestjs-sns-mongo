import {
  ClientUsedErrorCodeEnum,
  CommonErrorCodeEnum,
} from '@domain/common/enums/error-code.enum';
import { IFormatExceptionMessage } from '@domain/exceptions/exceptions.interface';
import { LoggerService } from '@infrastructure/services/logger/logger.service';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request: any = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const result =
      exception instanceof HttpException
        ? (exception.getResponse() as IFormatExceptionMessage)
        : ({
            error_description: (exception as Error).message,
            error_text: '',
            error_code: CommonErrorCodeEnum.INTERNAL_SERVER,
          } as IFormatExceptionMessage);

    this.logMessage(request, result, status, exception);

    response.status(status).json(result);
  }

  private logMessage(
    request: any,
    result: IFormatExceptionMessage,
    status: number,
    exception: any,
  ) {
    if (status === 500) {
      this.logger.error(
        `End Request for ${request.path}`,
        `method=${request.method}
        status=${status} error_code=${
          result.error_code ? result.error_code : null
        } message=${result.error_description}`,
        status >= 500 ? exception.stack : '',
      );
    } else {
      this.logger.warn(
        `End Request for ${request.path}`,
        `method=${request.method} status=${status} error_code=${
          result.error_code ? result.error_code : null
        } message=${result.error_description}`,
      );
    }
  }
}
