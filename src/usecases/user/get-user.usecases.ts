import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { Types } from 'mongoose';

export class GetUserUseCases {
  constructor(private readonly userRepository: IUserRepository) {}

  async getUserById(userId: Types.ObjectId) {
    return await this.userRepository.getUserById(userId);
  }
}
