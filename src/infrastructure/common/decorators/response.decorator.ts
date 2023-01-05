import { BaseResponseFormat } from '@domain/response/base.response';
import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';

export const ApiResponseType = <TModel extends Type<BaseResponseFormat>>(
  model?: TModel,
  is_array?: boolean,
) => {
  const options: ApiResponseOptions = model
    ? {
        schema: {
          allOf: [
            is_array
              ? { type: 'array', items: { $ref: getSchemaPath(model) } }
              : { $ref: getSchemaPath(model) },
          ],
        },
      }
    : { type: String, isArray: is_array };

  return applyDecorators(ApiOkResponse(options));
};
