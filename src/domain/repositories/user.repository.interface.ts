import { AuthTypeEnum } from '@domain/common/enums/user/auth-type.enum';
import { CreateUserModel, UserModel } from '@domain/model/database/user';
import { ClientSession, FilterQuery, Types, UpdateQuery } from 'mongoose';

export interface IUserRepository {
  insert(data: CreateUserModel, session?: ClientSession): Promise<UserModel>;

  getUserById(userId: Types.ObjectId): Promise<UserModel | null>;

  getUserByEmail(email: string): Promise<UserModel | null>;

  getUserByOAuthPayload(
    provider: AuthTypeEnum,
    providerUserId: string,
  ): Promise<UserModel | null>;

  getUsers(): Promise<UserModel[]>;

  getUsersByQuery(query: FilterQuery<UserModel>): Promise<UserModel[]>;

  updateUserByUpdateQuery(
    userId: Types.ObjectId,
    query: UpdateQuery<UserModel>,
    session?: ClientSession,
  ): Promise<void>;
}
