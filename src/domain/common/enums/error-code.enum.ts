export const enum CommonErrorCodeEnum {
  INVALID_PARAM = -1,
  UNAUTHORIZED = -2,
  NOT_ENABLED_FEATURE = -3,
  BLOCKED = -4,
  FORBIDDEN_REQUEST = -5,
  INTERNAL_SERVER = -6,
  UNDER_INSPECTION = -7,
}

export const enum ClientUsedErrorCodeEnum {
  ACCESS_TOKEN_EXPIRED = 1,
  REFRESH_TOKEN_EXPIRED = 2,
}

export const ClientUsedErrorTextMap = {
  1: '액세스 토큰 만료',
  2: '리프레시 토큰 만료',
};
