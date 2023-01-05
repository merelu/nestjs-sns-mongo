export enum GenderTypeEnum {
  unspecified,
  male,
  female,
}

export const genderTypeEnumMap = (key: string) => {
  return GenderTypeEnum[key as keyof typeof GenderTypeEnum];
};
