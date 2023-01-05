import { AuthTypeEnum } from '@domain/common/enums/user/auth-type.enum';
import { CreateUserModel, UserModel } from '@domain/model/database/user';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { User, UserDocument } from '@infrastructure/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ClientSession,
  FilterQuery,
  Model,
  Types,
  UpdateQuery,
} from 'mongoose';

@Injectable()
export class DatabaseUserRepository implements IUserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userEntityRepository: Model<UserDocument>,
  ) {}

  async insert(
    data: CreateUserModel,
    session?: ClientSession,
  ): Promise<UserModel> {
    const entity = this.toUserEntity(data);
    const result = await this.userEntityRepository.create([entity], {
      session,
    });
    return this.toUser(result[0]);
  }

  async getUserById(userId: Types.ObjectId): Promise<UserModel | null> {
    const result = await this.userEntityRepository.findById(userId);
    if (!result) {
      return null;
    }
    return this.toUser(result);
  }

  async getUsers(): Promise<UserModel[]> {
    const result = await this.userEntityRepository.find();

    return result.map((item) => this.toUser(item));
  }

  async getUsersByQuery(
    query: FilterQuery<UserDocument>,
  ): Promise<UserModel[]> {
    const result = await this.userEntityRepository.find(query);

    return result.map((item) => this.toUser(item));
  }

  async getUserByEmail(email: string): Promise<UserModel | null> {
    const result = await this.userEntityRepository.findOne({
      email: email,
    });

    if (!result) {
      return null;
    }
    return this.toUser(result);
  }

  async getUserByOAuthPayload(
    provider: AuthTypeEnum,
    providerUserId: string,
  ): Promise<UserModel | null> {
    const result = await this.userEntityRepository.findOne({
      auth_type: provider,
      oauth_user_id: providerUserId,
    });

    if (!result) {
      return null;
    }

    return this.toUser(result);
  }

  async updateUserByUpdateQuery(
    userId: Types.ObjectId,
    query: UpdateQuery<UserDocument>,
    session?: ClientSession,
  ): Promise<void> {
    await this.userEntityRepository.findByIdAndUpdate(userId, query, {
      session,
    });
  }

  private toUser(doc: UserDocument): UserModel {
    const result = new UserModel();
    result._id = doc._id;
    result.channel_id = doc.channel_id;
    result.name = doc.name;
    result.email = doc.email;
    result.mobile = doc.mobile;

    result.birthday = doc.birthday;
    result.gender_type = doc.gender_type;
    result.auth_type = doc.auth_type;
    result.oauth_user_id = doc.oauth_user_id;
    result.status = doc.status;

    result.profile_image = doc.profile_image;
    result.device_info = doc.device_info;
    result.last_login_at = doc.last_login_at;

    result.push_agree = doc.push_agree;

    result.withdraw = doc.withdraw;
    result.withdrew_at = doc.withdrew_at;

    result.created_at = doc.created_at;
    result.updated_at = doc.updated_at;

    return result;
  }

  private toUserEntity(data: CreateUserModel): User {
    const result = new User();

    result.email = data.email;
    result.auth_type = data.auth_type;
    result.oauth_user_id = data.oauth_user_id;
    result.device_info = data.device_info;
    result.birthday = data.birthday;
    result.name = data.name;
    result.gender_type = data.gender_type;
    result.profile_image = data.profile_image;

    return result;
  }
}
