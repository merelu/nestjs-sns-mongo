import { IMAGE_BASE_URL } from '@domain/common/constants/image.baseurl';
import { ImageModel } from '@domain/model/database/image';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { UpdateUserDto } from '@infrastructure/controllers/user/user.dto';
import { Types } from 'mongoose';

export class UpdateUserUseCases {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: Types.ObjectId, data: UpdateUserDto) {
    await this.userRepository.updateUserByUpdateQuery(userId, {
      $set: {
        name: data.name,
        birthday: data.birthday,
        gender_type: data.gender_type,
        push_agree: data.push_agree,
        profile_image: data.profile_filename
          ? this.toImageModel(
              `user/${userId.toString()}/profile/${data.profile_filename}`,
            )
          : undefined,
      },
    });
  }

  async disconnectCouple(userId: Types.ObjectId) {
    await this.userRepository.updateUserByUpdateQuery(userId, {
      $set: {
        channel_id: null,
      },
    });
  }

  private toImageModel(key: string): ImageModel {
    const result = new ImageModel();
    result.key = key;
    result.url = `${IMAGE_BASE_URL}/${key}`;

    return result;
  }
}
