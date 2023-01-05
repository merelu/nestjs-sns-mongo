import { IUserRepository } from '@domain/repositories/user.repository.interface';
import dayjs from 'dayjs';
import { Types } from 'mongoose';

export class WithdrawUserUseCases {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: Types.ObjectId) {
    await this.userRepository.updateUserByUpdateQuery(userId, {
      $set: {
        withdraw: true,
        withdrew_at: dayjs().toDate(),
        push_agree: false,
        device_token: null,
      },
    });
  }
}
