import { SchemaNames } from '@domain/common/constants/schema-names';
import {
  CreateMessageModel,
  MessageModel,
} from '@domain/model/database/message';
import { IMessageRepository } from '@domain/repositories/message.repository.interface';
import {
  Message,
  MessageDocument,
} from '@infrastructure/entities/message.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession } from 'mongodb';
import { FilterQuery, Model, Types } from 'mongoose';

@Injectable()
export class DatabaseMessageRepository implements IMessageRepository {
  constructor(
    @InjectModel(SchemaNames.message)
    private readonly messageEntityRepository: Model<MessageDocument>,
  ) {}

  async insert(
    data: CreateMessageModel,
    session?: ClientSession,
  ): Promise<MessageModel> {
    const messageEntity = this.toMessageEntity(data);
    const [result] = await this.messageEntityRepository.create(
      [messageEntity],
      {
        session,
      },
    );

    return this.toMessage(result);
  }

  async getMessagesByQuery(
    query: FilterQuery<MessageDocument>,
  ): Promise<MessageModel[]> {
    const result = await this.messageEntityRepository.find(query);

    return result.map((item) => this.toMessage(item));
  }

  async updateMessagesIsRead(
    userId: Types.ObjectId,
    messageIds: Types.ObjectId[],
    session?: ClientSession,
  ): Promise<void> {
    await this.messageEntityRepository.updateMany(
      {
        $and: [
          { _id: { $in: messageIds } },
          { $ne: { read_user_ids: userId } },
        ],
      },
      {
        $addToSet: {
          read_user_ids: userId,
        },
      },
      { session: session },
    );
  }

  private toMessage(doc: MessageDocument): MessageModel {
    const result = new MessageModel();
    result._id = doc._id;
    result.channel_id = doc.channel_id;
    result.sender_id = doc.sender_id;
    result.type = doc.type;
    result.content = doc.content;
    result.read_user_ids = doc.read_user_ids;

    return result;
  }

  private toMessageEntity(data: CreateMessageModel): Message {
    const result: Message = new Message();

    result.sender_id = data.sender_id;
    result.channel_id = data.channel_id;
    result.type = data.type;
    result.content = data.content;
    result.read_user_ids = [data.sender_id];

    return result;
  }
}
