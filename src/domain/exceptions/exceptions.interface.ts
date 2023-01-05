import {
  ClientUsedErrorCodeEnum,
  CommonErrorCodeEnum,
} from '@domain/common/enums/error-code.enum';
import { HttpException } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

export interface IFormatExceptionMessage {
  error_code: CommonErrorCodeEnum | ClientUsedErrorCodeEnum;
  error_text?: string;
  error_description?: string;
}

export interface IException {
  badRequestException(data: IFormatExceptionMessage): HttpException;
  notFoundException(data: IFormatExceptionMessage): HttpException;
  internalServerErrorException(data?: IFormatExceptionMessage): HttpException;
  forbiddenException(data?: IFormatExceptionMessage): HttpException;
  unauthorizedException(data?: IFormatExceptionMessage): HttpException;
  wsException(data: IFormatExceptionMessage): WsException;
}
